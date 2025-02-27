import { ObjectLiteral, QueryRunner, Repository, DataSource } from 'typeorm';
import { IBaseRepository } from '../repositories/IBaseRepository';
import { IUOWRepositoryManager } from '../unit-of-work/IUowRepositoryManager';
import { DBAdapterRegistry } from '../config/DBAdapterRegistry';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UOWRepositoryManager implements IUOWRepositoryManager {
	private queryRunner: QueryRunner;
	private dbAdapterRegistry: DBAdapterRegistry;

	constructor(typeOrmDatasource: DataSource, dbAdapterRegistry: DBAdapterRegistry) {
		this.queryRunner = typeOrmDatasource.createQueryRunner();
		this.dbAdapterRegistry = dbAdapterRegistry; 
	}

	public getRepository<I extends IBaseRepository<unknown, T>, T extends ObjectLiteral>(e: { new (): T }): I {
		const repo = this.dbAdapterRegistry.get(e);
		return new repo(new Repository(e, this.queryRunner.manager, this.queryRunner)) as I;
	}

	private async initTransaction(): Promise<void> {
		await this.queryRunner.connect();
		await this.queryRunner.startTransaction();
	}

	public async runSafe(fn: (uow: IUOWRepositoryManager) => Promise<void>): Promise<void> {
		await this.initTransaction();
		try {
			await fn(this);
			await this.queryRunner.commitTransaction();
		} catch (error) {
			await this.queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await this.queryRunner.release();
		}
	}
}
