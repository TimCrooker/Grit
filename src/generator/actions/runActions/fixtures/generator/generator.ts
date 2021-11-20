/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CreateAction } from '../../../createAction'

module.exports = {
	actions() {
		return [
			CreateAction.add({
				files: '**',
				data: (context) => ({ name: 'Tim' }),
			}),
		]
	},
}
