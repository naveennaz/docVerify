import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {DocumentType} from './document-type.model';

@model({
  settings: {
    mysql: {
      table: 'documents'
    }
  }
})
export class Document extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    mysql: {
      columnName: 'id',
      dataType: 'int'
    }
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'title',
      dataType: 'varchar',
      dataLength: 255
    }
  })
  title: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'file_path',
      dataType: 'varchar',
      dataLength: 500
    }
  })
  filePath: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'file_name',
      dataType: 'varchar',
      dataLength: 255
    }
  })
  fileName: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'mime_type',
      dataType: 'varchar',
      dataLength: 100
    }
  })
  mimeType?: string;

  @property({
    type: 'number',
    mysql: {
      columnName: 'file_size',
      dataType: 'bigint'
    }
  })
  fileSize?: number;

  @property({
    type: 'number',
    required: true,
    mysql: {
      columnName: 'document_type_id',
      dataType: 'int'
    }
  })
  documentTypeId: number;

  @property({
    type: 'number',
    required: true,
    mysql: {
      columnName: 'uploaded_by',
      dataType: 'int'
    }
  })
  uploadedBy: number;

  @property({
    type: 'string',
    default: 'pending',
    mysql: {
      columnName: 'status',
      dataType: 'varchar',
      dataLength: 50
    }
  })
  status?: string; // 'pending', 'approved', 'rejected'

  @property({
    type: 'number',
    mysql: {
      columnName: 'approved_by',
      dataType: 'int'
    }
  })
  approvedBy?: number;

  @property({
    type: 'date',
    mysql: {
      columnName: 'approved_at',
      dataType: 'timestamp'
    }
  })
  approvedAt?: Date;

  @property({
    type: 'string',
    mysql: {
      columnName: 'remarks',
      dataType: 'text'
    }
  })
  remarks?: string;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'created_at',
      dataType: 'timestamp'
    }
  })
  createdAt?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'updated_at',
      dataType: 'timestamp'
    }
  })
  updatedAt?: Date;

  @belongsTo(() => User, {name: 'uploader'})
  uploaderId: number;

  @belongsTo(() => DocumentType)
  documentTypeRelId: number;

  constructor(data?: Partial<Document>) {
    super(data);
  }
}

export interface DocumentRelations {
  uploader?: User;
  documentType?: DocumentType;
}

export type DocumentWithRelations = Document & DocumentRelations;
