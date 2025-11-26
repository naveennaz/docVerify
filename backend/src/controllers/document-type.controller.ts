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
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {DocumentType} from '../models';
import {DocumentTypeRepository, UserRepository} from '../repositories';

@authenticate('jwt')
export class DocumentTypeController {
  constructor(
    @repository(DocumentTypeRepository)
    public documentTypeRepository: DocumentTypeRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/document-types')
  @response(200, {
    description: 'DocumentType model instance',
    content: {'application/json': {schema: getModelSchemaRef(DocumentType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentType, {
            title: 'NewDocumentType',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    documentType: Omit<DocumentType, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<DocumentType> {
    const userId = parseInt(currentUserProfile[securityId]);
    const user = await this.userRepository.findById(userId);

    if (user.role !== 'admin' && user.role !== 'document_creator') {
      throw new HttpErrors.Forbidden('You do not have permission to create document types');
    }

    documentType.createdBy = userId;
    return this.documentTypeRepository.create(documentType);
  }

  @get('/document-types/count')
  @response(200, {
    description: 'DocumentType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DocumentType) where?: Where<DocumentType>,
  ): Promise<Count> {
    return this.documentTypeRepository.count(where);
  }

  @get('/document-types')
  @response(200, {
    description: 'Array of DocumentType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DocumentType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DocumentType) filter?: Filter<DocumentType>,
  ): Promise<DocumentType[]> {
    return this.documentTypeRepository.find(filter);
  }

  @get('/document-types/{id}')
  @response(200, {
    description: 'DocumentType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DocumentType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DocumentType, {exclude: 'where'}) filter?: FilterExcludingWhere<DocumentType>
  ): Promise<DocumentType> {
    return this.documentTypeRepository.findById(id, filter);
  }

  @patch('/document-types/{id}')
  @response(204, {
    description: 'DocumentType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentType, {partial: true}),
        },
      },
    })
    documentType: DocumentType,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    const userId = parseInt(currentUserProfile[securityId]);
    const user = await this.userRepository.findById(userId);

    if (user.role !== 'admin' && user.role !== 'document_creator') {
      throw new HttpErrors.Forbidden('You do not have permission to update document types');
    }

    await this.documentTypeRepository.updateById(id, documentType);
  }

  @del('/document-types/{id}')
  @response(204, {
    description: 'DocumentType DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    const userId = parseInt(currentUserProfile[securityId]);
    const user = await this.userRepository.findById(userId);

    if (user.role !== 'admin') {
      throw new HttpErrors.Forbidden('Only admins can delete document types');
    }

    await this.documentTypeRepository.deleteById(id);
  }
}
