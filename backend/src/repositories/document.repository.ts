import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Document, DocumentRelations, User, DocumentType} from '../models';
import {UserRepository} from './user.repository';
import {DocumentTypeRepository} from './document-type.repository';

export class DocumentRepository extends DefaultCrudRepository<
  Document,
  typeof Document.prototype.id,
  DocumentRelations
> {
  public readonly uploader: BelongsToAccessor<User, typeof Document.prototype.id>;
  public readonly documentType: BelongsToAccessor<DocumentType, typeof Document.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('DocumentTypeRepository') protected documentTypeRepositoryGetter: Getter<DocumentTypeRepository>,
  ) {
    super(Document, dataSource);
    this.uploader = this.createBelongsToAccessorFor('uploader', userRepositoryGetter);
    this.documentType = this.createBelongsToAccessorFor('documentType', documentTypeRepositoryGetter);
    
    this.registerInclusionResolver('uploader', this.uploader.inclusionResolver);
    this.registerInclusionResolver('documentType', this.documentType.inclusionResolver);
  }
}
