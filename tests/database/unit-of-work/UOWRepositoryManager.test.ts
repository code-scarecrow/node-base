import { DataSource, QueryRunner } from "typeorm";
import { DBAdapterRegistry } from "../../../src/database/config/DBAdapterRegistry";
import { UOWRepositoryManager } from "../../../src/database/unit-of-work/UOWRepositoryManager";
import { IBaseRepository } from "../../../src/database/repositories/IBaseRepository";
import { BaseTypeOrmRepository } from "../../../src/database/repositories/BaseTypeOrmRepository";
import { MockProxy, mock } from "jest-mock-extended";

class TestEntity {
  public id!: number;
}

const TEST_REPO = "testRepo";
type ITestRepo = IBaseRepository<{ id: number }, TestEntity>;
class TestRepo
  extends BaseTypeOrmRepository<{ id: number }, TestEntity>
  implements ITestRepo {}

describe("UOWRepositoryManager Test.", () => {
  let dataSource: MockProxy<DataSource>;
  let queryRunner: MockProxy<QueryRunner>;

  beforeEach(async () => {
    dataSource = mock<DataSource>();
    queryRunner = mock<QueryRunner>();
    queryRunner.release.mockResolvedValue(undefined);
    queryRunner.rollbackTransaction.mockResolvedValue(undefined);
    dataSource.createQueryRunner.mockReturnValue(queryRunner);
  });

  it("Should call Roll back transaction in case of error during commit and re-throw same error.", async () => {
    //Arrange
    const dbAdapterRegistry = new DBAdapterRegistry();
    const uut = new UOWRepositoryManager(dataSource, dbAdapterRegistry);
    queryRunner.commitTransaction.mockRejectedValue(new Error("test"));

    //Act
    let err: Error | undefined = undefined;
    try {
      await uut.runSafe((_) => Promise.resolve());
    } catch (ex) {
      err = ex as Error;
    }

    //Assert
    expect(err).not.toBeUndefined();
    expect(err?.message).toBe("test");
    expect(queryRunner.commitTransaction).toBeCalledTimes(1);
    expect(queryRunner.release).toBeCalledTimes(1);
  });

  it("Shuold return a repository.", async () => {
    const dbAdapterRegistry = new DBAdapterRegistry();
    dbAdapterRegistry.register(TEST_REPO, TestRepo, TestEntity);
    const uut = new UOWRepositoryManager(dataSource, dbAdapterRegistry);
    const repo = uut.getRepository(TestEntity);
    expect(repo).toBeInstanceOf(TestRepo);
  });

  it("Should call initTransaction.", async () => {
    //Arrange
    const dbAdapterRegistry = new DBAdapterRegistry();
    const uut = new UOWRepositoryManager(dataSource, dbAdapterRegistry);
    queryRunner.connect.mockResolvedValue(undefined);
    queryRunner.startTransaction.mockResolvedValue(undefined);

    //Act
    await uut.runSafe((_) => Promise.resolve());

    //Assert
    expect(queryRunner.connect).toBeCalledTimes(1);
    expect(queryRunner.startTransaction).toBeCalledTimes(1);
  });
});
