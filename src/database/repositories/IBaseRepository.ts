import { ISingleEntityRepository } from './ISingleEntityRepository';

export interface IBaseRepository<TKey, TEntity extends TKey> extends ISingleEntityRepository<TKey, TEntity> {
	findAll(): Promise<TEntity[]>;
}
