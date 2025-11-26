import {Entity, model, property, hasMany} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';
import {Document} from './document.model';

@model({
  settings: {
    mysql: {
      table: 'users'
    },
    strict: false
  }
})
export class User extends Entity {
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
      columnName: 'email',
      dataType: 'varchar',
      dataLength: 255
    },
    index: {
      unique: true
    }
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'username',
      dataType: 'varchar',
      dataLength: 100
    }
  })
  username: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'role',
      dataType: 'varchar',
      dataLength: 50
    }
  })
  role: string; // 'admin', 'document_creator', 'document_uploader', 'document_approver'

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

  @hasMany(() => Document, {keyTo: 'uploadedBy'})
  documents: Document[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  documents?: Document[];
}

export type UserWithRelations = User & UserRelations;
