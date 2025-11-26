import {Entity, model, property, hasMany} from '@loopback/repository';
import {Document} from './document.model';

@model({
  settings: {
    mysql: {
      table: 'document_types'
    }
  }
})
export class DocumentType extends Entity {
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
      columnName: 'name',
      dataType: 'varchar',
      dataLength: 100
    }
  })
  name: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'description',
      dataType: 'text'
    }
  })
  description?: string;

  @property({
    type: 'boolean',
    default: true,
    mysql: {
      columnName: 'is_active',
      dataType: 'tinyint'
    }
  })
  isActive?: boolean;

  @property({
    type: 'number',
    required: true,
    mysql: {
      columnName: 'created_by',
      dataType: 'int'
    }
  })
  createdBy: number;

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

  @hasMany(() => Document, {keyTo: 'documentTypeId'})
  documents: Document[];

  constructor(data?: Partial<DocumentType>) {
    super(data);
  }
}

export interface DocumentTypeRelations {
  documents?: Document[];
}

export type DocumentTypeWithRelations = DocumentType & DocumentTypeRelations;
