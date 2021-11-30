import { GeneratorConfig, Grit } from '@/index'

export type DataProvider = (
	context: Grit
) => Promise<Record<string, any>> | Record<string, any>

/** Data section runtime class */
export class Data {
	private grit: Grit
	private _data: Record<string, any> = {}
	private dataFunctions: DataProvider[] = []

	constructor(context: Grit) {
		this.grit = context
	}

	async run(grit: Grit = this.grit): Promise<void> {
		// Gets extra data from the generator config's data section
		await this.getData(grit)
	}

	/** Get the data from the generator file */
	async getData(
		context: Grit = this.grit,
		config: GeneratorConfig['data'] = this.grit.config.data
	): Promise<void> {
		const dataObject =
			typeof config === 'function' ? await config.call(this, context) : config

		if (dataObject) this.data = { ...this.data, ...dataObject }

		for (const dataFn of this.dataFunctions) {
			const data = (await dataFn(context)) ?? {}
			this.data = { ...this.data, ...data }
		}
	}

	/**
	 * Provide data providing functions to be executed at the end of the data section
	 *
	 * this allows you to hook into the data section of a generator to add new functionality
	 */
	registerDataProvider(dataProvider: DataProvider): void {
		this.dataFunctions.push(dataProvider)
	}

	/**
	 * Runtime availiable methods
	 */

	/** Helper method to instantly add data to the data section*/
	add(value: Record<string, any>): this {
		this._data = { ...this._data, ...value }
		return this
	}

	/**
	 * Runtime availiable Properties
	 */

	get data(): Record<string, any> {
		return this._data
	}

	set data(value: Record<string, any>) {
		this._data = value
	}
}
