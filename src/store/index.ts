import { ROOT_CACHE_PATH } from '../config'
import { BaseStore, BaseStoreOptions } from './baseStore'

export type StoreOptions = BaseStoreOptions

export class Store extends BaseStore<any> {
	constructor(options: StoreOptions) {
		super({ ...options })
	}
}

export const store = new Store({ storePath: ROOT_CACHE_PATH })
