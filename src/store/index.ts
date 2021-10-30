import { ROOT_CACHE_PATH } from '../config'
import { logger } from '../utils/logger'
import { writeFileSync } from 'fs'
import { readFileSync } from 'fs'
import { mkdirSync } from 'fs'
import dotProp from 'dot-prop'
import path from 'path'

export type StoreFileData<T = any> = { [key: string]: T }

export interface StoreOptions {
	storePath: string
	storeFileName?: string
}

export class Store<T = any> {
	/** contents of the store file */
	data: StoreFileData<T>
	/** Path to the store directory */
	storePath: string
	/** Path to the store config file */
	storeFilePath: string

	constructor(options: StoreOptions) {
		logger.debug('Store path:', options.storePath)

		this.storePath = options.storePath

		this.storeFilePath = path.join(
			options.storePath,
			options.storeFileName || 'store.json'
		)

		this.initiateStore()

		this.data = this.read()
	}

	private initiateStore(): void {
		logger.debug('Initializing store directory')
		try {
			mkdirSync(this.storePath, { recursive: true })
		} catch (error) {
			logger.debug(error)
		}
	}

	read(): StoreFileData<T> {
		try {
			return JSON.parse(readFileSync(this.storeFilePath, 'utf8'))
		} catch (_) {
			return {}
		}
	}

	/**
	 * Set an item into the store
	 *
	 * @param overwrite (defaults to true) if set to false, items in the store
	 * are protected from being overwritten
	 */
	set(key: string, value: any, overwrite = true): void {
		const alreadyCached = this.data[key]
		if (alreadyCached && !overwrite) {
			logger.debug('Not overwriting item in cache:', {
				key: alreadyCached,
			})
			return
		}
		dotProp.set(this.data, key, value)
		logger.debug(`Updating ${this.storeFilePath}`)
		writeFileSync(this.storeFilePath, JSON.stringify(this.data), 'utf8')
	}

	/**
	 * Get item from the store whose key matches the provided one
	 */
	get(key: string): any {
		return dotProp.get(this.data, key)
	}

	/**
	 * Iterates over the entire store and finds all items where condition is matched
	 *
	 * gets passed a function that is run for each item of of the store used to match items
	 */
	getAllWhere(filterFunction: (key: string, value: any) => boolean): any[] {
		return Object.entries(this.data)
			.filter(([key, value]) => filterFunction(key, value))
			.map(([, value]) => {
				return value
			})
	}
}

export const store = new Store({ storePath: ROOT_CACHE_PATH })
