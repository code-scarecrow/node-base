import { ObjectLiteral } from 'typeorm';
import { IBaseRepository } from '../repositories/IBaseRepository';

export interface IUOWRepositoryManager {
	getRepository<I extends IBaseRepository<unknown, T>, T extends ObjectLiteral>(entity: { new (): T }): I;
	runSafe(fn: (uow: IUOWRepositoryManager) => Promise<void>): Promise<void>;
}
