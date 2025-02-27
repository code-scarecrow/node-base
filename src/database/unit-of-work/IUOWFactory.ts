import { IUOWRepositoryManager } from './IUowRepositoryManager';

export const UOW_FACTORY = 'IUOWFactory';

export interface IUOWFactory {
	getUnitOfWork(): IUOWRepositoryManager;
}
