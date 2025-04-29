import { ISingleEntityRepository } from './ISingleEntityRepository';

export interface IBaseRepository<TKey, TEntity extends TKey, TCreate = TEntity, TUpdate = TCreate> extends ISingleEntityRepository<TKey, TEntity, TCreate, TUpdate> {
	findAll(): Promise<TEntity[]>;
}
