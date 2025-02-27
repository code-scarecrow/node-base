import { InsertResult, Repository } from "typeorm";
import { ITestEntity, TestRepository } from "./TestRepository";
import { MockProxy, mock } from "jest-mock-extended";

describe("Base Repository Test", () => {
  let typeOrmRepo: MockProxy<Repository<ITestEntity>>;
  let uut: TestRepository;

  beforeEach(async () => {
    typeOrmRepo = mock<Repository<ITestEntity>>();

    uut = new TestRepository(typeOrmRepo);
  });

  it("FindAll call find", async () => {
    //Arrange
    typeOrmRepo.find.mockResolvedValue([]);

    //Act
    await uut.findAll();

    //Assert
    expect(typeOrmRepo.find).toBeCalledTimes(1);
  });

  it("FindByKey call findOne", async () => {
    //Arrange
    const key = { keyPart1: "test", keyPart2: "test" };
    typeOrmRepo.findOne.mockResolvedValue(null);

    //Act
    await uut.findByKey(key);

    //Assert
    expect(typeOrmRepo.findOne).toBeCalledTimes(1);
    expect(typeOrmRepo.findOne).toBeCalledWith({ where: key });
  });

  it("Create should return same entity && call insert", async () => {
    //Arrange
    const testEntity = getTestEntity();
    typeOrmRepo.insert.mockResolvedValue(mock<InsertResult>());

    //Act
    const res = await uut.create(testEntity);

    //Assert
    expect(res).toBe(testEntity);
    expect(typeOrmRepo.insert).toBeCalledTimes(1);
  });

  it("Update should return same entity && call update", async () => {
    //Arrange
    const testEntity = getTestEntity();
    typeOrmRepo.update.mockResolvedValue(mock<InsertResult>());

    //Act
    const res = await uut.update(
      { keyPart1: testEntity.keyPart1, keyPart2: testEntity.keyPart2 },
      testEntity
    );

    //Assert
    expect(res).toBe(testEntity);
    expect(typeOrmRepo.update).toBeCalledTimes(1);
  });

  it("Delete call delete", async () => {
    //Arrange
    const key = { keyPart1: "test", keyPart2: "test" };
    typeOrmRepo.delete.mockResolvedValue(mock<InsertResult>());

    //Act
    await uut.delete(key);

    //Assert
    expect(typeOrmRepo.delete).toBeCalledWith(key);
    expect(typeOrmRepo.delete).toBeCalledTimes(1);
  });
});

function getTestEntity(key1?: string): ITestEntity {
  return {
    keyPart1: key1 ?? "test",
    keyPart2: "test",
    column1: "test",
  };
}
