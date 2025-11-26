import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {DocumentType, DocumentTypeRelations, Document} from '../models';
import {DocumentRepository} from './document.repository';

export class DocumentTypeRepository extends DefaultCrudRepository<
  DocumentType,
  typeof DocumentType.prototype.id,
  DocumentTypeRelations
> {
  public readonly documents: HasManyRepositoryFactory<Document, typeof DocumentType.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('DocumentRepository') protected documentRepositoryGetter: Getter<DocumentRepository>,
  ) {
    super(DocumentType, dataSource);
    this.documents = this.createHasManyRepositoryFactoryFor('documents', documentRepositoryGetter);
    this.registerInclusionResolver('documents', this.documents.inclusionResolver);
  }
}
