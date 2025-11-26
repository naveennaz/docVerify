import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, Document} from '../models';
import {DocumentRepository} from './document.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly documents: HasManyRepositoryFactory<Document, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('DocumentRepository') protected documentRepositoryGetter: Getter<DocumentRepository>,
  ) {
    super(User, dataSource);
    this.documents = this.createHasManyRepositoryFactoryFor('documents', documentRepositoryGetter);
    this.registerInclusionResolver('documents', this.documents.inclusionResolver);
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<any | undefined> {
    return this.userCredentials(userId)
      .get()
      .catch((err: any) => {
        if (err.code === 'ENTITY_NOT_FOUND') return undefined;
        throw err;
      });
  }

  userCredentials: any;
}
