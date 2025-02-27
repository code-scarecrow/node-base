import { BaseTypeOrmRepository } from '../../../src/database/repositories/BaseTypeOrmRepository';
import { Repository } from 'typeorm';

export interface ITestEntity {
	keyPart1: string;
	keyPart2: string;
	column1: string;
}

export class TestRepository extends BaseTypeOrmRepository<{ keyPart1: string; keyPart2: string }, ITestEntity> {
	constructor(repository: Repository<ITestEntity>) {
		super(repository);
	}
}
