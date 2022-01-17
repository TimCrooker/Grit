import { CLI, Route } from 'clifi'
import pkg from '@/../package.json'

export type GritRoute = Route

export const cli = new CLI({
	pkg,
	debug: false,
	notifyUpdate: false,
	errorHandling: true,
})
