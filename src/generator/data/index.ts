import { GeneratorConfig, Grit } from '@/index'

/** Data section runtime class */
export class Data {
	grit: Grit
	private _data: Record<string, any> = {}

	constructor(context: Grit) {
		this.grit = context
	}

	async run(grit: Grit = this.grit): Promise<void> {
		// Gets extra data from the generator config's data section
		await this.getData(grit)
	}

	/** Get the list of prompts from the generator file */
	async getData(
		context: Grit = this.grit,
		config: GeneratorConfig['data'] = this.grit.config.data
	): Promise<void> {
		const dataObject =
			typeof config === 'function' ? await config.call(this, context) : config

		if (!dataObject) return

		this._data = { ...this.data, ...dataObject }
	}

	/**
	 * Runtime availiable methods
	 */

	/** Helper method to instantly add data to the data section*/
	add(): this {
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
