import { UnitOfWorkFactory } from '../../../src/database/unit-of-work/UnitOfWorkFactory';
import { DataSource, QueryRunner } from 'typeorm';
import { DBAdapterRegistry } from '../../../src/database/config';
import { MockProxy, mock } from 'jest-mock-extended';

describe('Unit of work factory test.', () => {
	let unitOfWorkFactory: UnitOfWorkFactory;
	let datasource: MockProxy<DataSource>;

	beforeEach(async () => {
		datasource = mock<DataSource>();
        const dbAdapterRegistry = new DBAdapterRegistry();
		unitOfWorkFactory = new UnitOfWorkFactory(datasource, dbAdapterRegistry);
	});

	it('should be defined.', async () => {
		//Assert
		expect(unitOfWorkFactory).not.toBeUndefined();
	});

	it('should send a user entity.', async () => {
		//Arrange
		datasource.createQueryRunner.mockReturnValue(mock<QueryRunner>());

		//Act
		const response = unitOfWorkFactory.getUnitOfWork();

		//Assert
		expect(response).not.toBeUndefined();
	});
});
