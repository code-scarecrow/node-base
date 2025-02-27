import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { Provider } from "@nestjs/common";
import { UnitOfWorkFactory } from "../unit-of-work/UnitOfWorkFactory";
import { IBaseRepository } from "../repositories/IBaseRepository";
import { UOW_FACTORY } from "../unit-of-work//IUOWFactory";

type Entity<T extends ObjectLiteral> = { new (): T };
type Repo<T extends ObjectLiteral> = {
  new (r: Repository<T>): IBaseRepository<unknown, T>;
};

interface IRepoRegistry<T extends ObjectLiteral> {
  repo: Repo<T>;
  dependecyId: string;
}

class RepositoryMapper {
  private map: Map<string, unknown> = new Map();

  public get<T extends ObjectLiteral>(
    entity: Entity<T>
  ): IRepoRegistry<T> | undefined {
    return this.map.get(entity.name) as IRepoRegistry<T>;
  }

  public set<T extends ObjectLiteral>(
    entity: Entity<T>,
    repository: IRepoRegistry<T>
  ): void {
    this.map.set(entity.name, repository);
  }

  public toArray<T extends ObjectLiteral>(): [string, IRepoRegistry<T>][] {
    return Array.from(this.map as Map<string, IRepoRegistry<T>>);
  }
}

export class DBAdapterRegistry {
  private repositories = new RepositoryMapper();

  public register<T extends ObjectLiteral>(
    dependecyId: string,
    repo: Repo<T>,
    entity: Entity<T>
  ): DBAdapterRegistry {
    this.repositories.set(entity, { repo, dependecyId });
    return this;
  }

  public get<T extends ObjectLiteral>(e: Entity<T>): Repo<T> {
    const repoConstructor = this.repositories.get(e);
    if (!repoConstructor) {
      throw new Error("Repository registry not found - " + e.name);
    }
    return repoConstructor.repo;
  }

  public getProviders(): Provider[] {
    const repos = this.repositories.toArray();
    const providers: Provider[] = repos.map(([_, r]) => {
      return { provide: r.dependecyId, useClass: r.repo };
    });
    providers.push({
      provide: UOW_FACTORY,
      useFactory: (datasource: DataSource) =>
        new UnitOfWorkFactory(datasource, this),
      inject: [DataSource],
    });
    return providers;
  }
}
