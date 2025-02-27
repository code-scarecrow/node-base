import { AsyncLocalStorage } from 'async_hooks';

const storage = new AsyncLocalStorage<string>();

export { storage };
