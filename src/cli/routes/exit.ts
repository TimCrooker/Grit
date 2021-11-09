import { GritRoute } from '../cli'

export const exit: GritRoute = async (app, { args, options }) => {
	console.log('exit')
}
