import { GritRoute } from '../cli'

/**
 *  This route lets the user search for generators using npm search.
 */
export const find: GritRoute = (app, { args, options }) => {
	// get the generators from npm (packages that start with `grit-`)
	// Put those generators into the list format and present them as choices
	// prompt the user using an autocomplete `fuzzy` inquirer prompt
	// after the user has chosen the generator prompt them to install it for later or install & run it
}

export const FindChoice = {
	name: 'Search for new generators',
	value: 'find',
}
