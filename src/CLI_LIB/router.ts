import { CLI } from './cli'

export type Input = { [k: string]: any}

export type Route =
	| ((
			app: CLI,
			input: { args: any[]; options: { [key: string]: any } }
	  ) => void)
	| ((
			app: CLI,
			input: { args: any[]; options: { [key: string]: any } }
	  ) => Promise<void>)
export type Routes = { [k: string]: Route }

export interface RouterOptions {
	routesPath: string
}

/**
 * The router is in charge of handling `yo` different screens.
 */
export class Router {
	routesPath: string
	routes: Routes

	constructor(opts: RouterOptions) {
		this.routesPath = opts.routesPath
		this.routes = {}
	}

	/**
	 * Navigate to a route
	 * @param name Route name
	 * @param args the arguments to pass to the route handler
	 */
	async navigate(name: string, args: any, context: CLI): Promise<void> {
		if (typeof this.routes[name] === 'function') {
			await this.routes[name].call(null, context, args)
		} else {
			throw new Error(`No routes named: ${name}`)
		}
	}

	/**
	 * Register a route handler
	 * @param name Name of the route
	 * @param handler Route handler
	 */
	registerRoute(name: string, handler: Route): this {
		this.routes[name] = handler
		return this
	}
}
