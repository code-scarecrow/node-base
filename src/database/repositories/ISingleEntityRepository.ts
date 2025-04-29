export interface ISingleEntityRepository<TKey, TEntity extends TKey, TCreate = TEntity, TUpdate = TCreate> {
	findByKey(key: TKey): Promise<TEntity | null>;
	create(entity: TCreate): Promise<TEntity>;
	update(key: TKey, entity: TUpdate): Promise<TEntity>;
	delete(key: TKey): Promise<void>;
}
