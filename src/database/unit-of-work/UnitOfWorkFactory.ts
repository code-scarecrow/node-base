import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { UOWRepositoryManager } from "./UOWRepositoryManager";
import { IUOWFactory } from "./IUOWFactory";
import { IUOWRepositoryManager } from "./IUowRepositoryManager";
import { DBAdapterRegistry } from "../config/DBAdapterRegistry";

@Injectable()
export class UnitOfWorkFactory implements IUOWFactory {
  constructor(
    private typeOrmDatasource: DataSource,
    private dbAdapterRegistry: DBAdapterRegistry
  ) {}

  public getUnitOfWork(): IUOWRepositoryManager {
    return new UOWRepositoryManager(
      this.typeOrmDatasource,
      this.dbAdapterRegistry
    );
  }
}
