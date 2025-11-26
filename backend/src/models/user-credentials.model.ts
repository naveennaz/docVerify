import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model({
  settings: {
    mysql: {
      table: 'user_credentials'
    },
    hiddenProperties: ['password']
  }
})
export class UserCredentials extends Entity {
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
    type: 'number',
    required: true,
    mysql: {
      columnName: 'user_id',
      dataType: 'int'
    }
  })
  userId: number;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'password',
      dataType: 'varchar',
      dataLength: 255
    }
  })
  password: string;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {
  user?: User;
}

export type UserCredentialsWithRelations = UserCredentials & UserCredentialsRelations;
