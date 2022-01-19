/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Generator } from '@/generator/createGenerator'

module.exports = new Generator({
	data() {
		this.add({ name: 'Tim' })

		return { foo: 'bar' }
	},
})
