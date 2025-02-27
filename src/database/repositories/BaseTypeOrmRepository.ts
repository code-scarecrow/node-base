import { Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { IBaseRepository } from './IBaseRepository';

@Injectable()
export abstract class BaseTypeOrmRepository<TKey extends ObjectLiteral, TEntity extends TKey>
	implements IBaseRepository<TKey, TEntity>
{
	constructor(protected repo: Repository<TEntity>) {}

	public async findAll(): Promise<TEntity[]> {
		return this.repo.find();
	}

	public async findByKey(key: TKey): Promise<TEntity | null> {
		return this.repo.findOne({ where: key });
	}

	public async create(entity: TEntity): Promise<TEntity> {
		await this.repo.insert(entity);
		return entity;
	}

	public async update(key: TKey, entity: TEntity): Promise<TEntity> {
		await this.repo.update(key, entity);
		return entity;
	}

	public async delete(key: TKey): Promise<void> {
		this.repo.delete(key);
	}
}
