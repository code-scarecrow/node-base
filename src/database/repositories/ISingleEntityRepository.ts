export interface ISingleEntityRepository<TKey, TEntity extends TKey> {
	findByKey(key: TKey): Promise<TEntity | null>;
	create(entity: TEntity): Promise<TEntity>;
	update(key: TKey, entity: TEntity): Promise<TEntity>;
	delete(key: TKey): Promise<void>;
}
