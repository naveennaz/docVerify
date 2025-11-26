import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
  HttpErrors,
  Request,
  RestBindings,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import multer from 'multer';
import path from 'path';
import {promisify} from 'util';
import {Document} from '../models';
import {DocumentRepository, UserRepository, DocumentTypeRepository} from '../repositories';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({storage: storage});

@authenticate('jwt')
export class DocumentController {
  constructor(
    @repository(DocumentRepository)
    public documentRepository: DocumentRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(DocumentTypeRepository)
    public documentTypeRepository: DocumentTypeRepository,
  ) {}

  @post('/documents/upload')
  @response(200, {
    description: 'Document upload',
    content: {'application/json': {schema: getModelSchemaRef(Document)}},
  })
  async upload(
    @requestBody({
      description: 'multipart/form-data value',
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary',
              },
              title: {
                type: 'string',
              },
              documentTypeId: {
                type: 'number',
              },
              remarks: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.REQUEST) req: Request,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Document> {
    const userId = parseInt(currentUserProfile[securityId]);
    const user = await this.userRepository.findById(userId);

    if (user.role !== 'admin' && user.role !== 'document_uploader') {
      throw new HttpErrors.Forbidden('You do not have permission to upload documents');
    }

    return new Promise<Document>((resolve, reject) => {
      upload.single('file')(req, {} as any, async (err: any) => {
        if (err) {
          reject(err);
        } else {
          try {
            const file = (req as any).file;
            const {title, documentTypeId, remarks} = (req as any).body;

            if (!file) {
              throw new HttpErrors.BadRequest('No file uploaded');
            }

            // Verify document type exists
            await this.documentTypeRepository.findById(parseInt(documentTypeId));

            const document = await this.documentRepository.create({
              title,
              fileName: file.originalname,
              filePath: file.path,
              mimeType: file.mimetype,
              fileSize: file.size,
              documentTypeId: parseInt(documentTypeId),
              uploadedBy: userId,
              status: 'pending',
              remarks,
            });

            resolve(document);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }

  @get('/documents/count')
  @response(200, {
    description: 'Document model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Document) where?: Where<Document>): Promise<Count> {
    return this.documentRepository.count(where);
  }

  @get('/documents')
  @response(200, {
    description: 'Array of Document model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Document, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Document) filter?: Filter<Document>,
    @inject(SecurityBindings.USER)
    currentUserProfile?: UserProfile,
  ): Promise<Document[]> {
    const userId = parseInt(currentUserProfile![securityId]);
    const user = await this.userRepository.findById(userId);

    // If user is uploader, only show their documents
    if (user.role === 'document_uploader') {
      return this.documentRepository.find({
        ...filter,
        where: {...filter?.where, uploadedBy: userId},
        include: [{relation: 'uploader'}, {relation: 'documentType'}],
      });
    }

    // Admin and approver can see all
    return this.documentRepository.find({
      ...filter,
      include: [{relation: 'uploader'}, {relation: 'documentType'}],
    });
  }

  @get('/documents/{id}')
  @response(200, {
    description: 'Document model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Document, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Document, {exclude: 'where'})
    filter?: FilterExcludingWhere<Document>,
  ): Promise<Document> {
    return this.documentRepository.findById(id, filter);
  }

  @patch('/documents/{id}/approve')
  @response(204, {
    description: 'Document approval success',
  })
  async approve(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {type: 'string', enum: ['approved', 'rejected']},
              remarks: {type: 'string'},
            },
          },
        },
      },
    })
    approvalData: {status: string; remarks?: string},
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    const userId = parseInt(currentUserProfile[securityId]);
    const user = await this.userRepository.findById(userId);

    if (user.role !== 'admin' && user.role !== 'document_approver') {
      throw new HttpErrors.Forbidden(
        'You do not have permission to approve documents',
      );
    }

    await this.documentRepository.updateById(id, {
      status: approvalData.status,
      approvedBy: userId,
      approvedAt: new Date(),
      remarks: approvalData.remarks,
    });
  }

  @patch('/documents/{id}')
  @response(204, {
    description: 'Document PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {partial: true}),
        },
      },
    })
    document: Document,
  ): Promise<void> {
    await this.documentRepository.updateById(id, document);
  }

  @del('/documents/{id}')
  @response(204, {
    description: 'Document DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    const userId = parseInt(currentUserProfile[securityId]);
    const user = await this.userRepository.findById(userId);

    if (user.role !== 'admin') {
      throw new HttpErrors.Forbidden('Only admins can delete documents');
    }

    await this.documentRepository.deleteById(id);
  }
}
