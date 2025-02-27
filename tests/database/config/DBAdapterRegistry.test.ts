import { ObjectLiteral, Repository } from 'typeorm';
import { IBaseRepository } from '../../../src/database/repositories/IBaseRepository';
import { BaseTypeOrmRepository } from '../../../src/database/repositories/BaseTypeOrmRepository';
import { DBAdapterRegistry } from '../../../src/database/config';

class TestEntity {
	public id!: number;
}
const TEST_REPO = 'testRepo';
type ITestRepo = IBaseRepository<{ id: number }, TestEntity>;
class TestRepo extends BaseTypeOrmRepository<{ id: number }, TestEntity> implements ITestRepo {}
type Repo<T extends ObjectLiteral> = { new (r: Repository<T>): IBaseRepository<unknown, T> };

describe('DBAdapterRegistry Test', () => {
    
	it('Should throw error if registry not found.', async () => {
		//Act
        const dbAdapterRegistry = new DBAdapterRegistry();
		const act = (): Repo<TestEntity> => dbAdapterRegistry.get(TestEntity);

		//Assert
		expect(act).toThrow();
	});

	it('Get Repository.', async () => {
		//Act
        const dbAdapterRegistry = new DBAdapterRegistry();
		dbAdapterRegistry.register(TEST_REPO, TestRepo, TestEntity);
		const res = dbAdapterRegistry.get(TestEntity);

		//Assert
		expect(res).not.toBeUndefined();
	});

	it('Get Providers.', async () => {
		//Act
        const dbAdapterRegistry = new DBAdapterRegistry();
		dbAdapterRegistry.register(TEST_REPO, TestRepo, TestEntity);
		const action = dbAdapterRegistry.getProviders();
		//Assert
		expect(action).not.toBeUndefined();
	});
});
