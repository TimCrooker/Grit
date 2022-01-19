import axios from 'axios'

type NpmSearchModule = {
	package: {
		name: string
		description?: string
		version: string
	}
}

export interface NpmSearchResult {
	data: {
		objects: Array<NpmSearchModule>
	}
}

interface NpmSearchOptions {
	keywords: string[]
	resultCount: number
	// callback: (modules: NpmSearchModule[]) => any
}

export type NpmSearchFn<T = any> = (
	options: NpmSearchOptions
) => Promise<Array<NpmSearchModule> | T>

export const NpmSearch: NpmSearchFn = async ({ keywords, resultCount }) => {
	const result: NpmSearchResult = await axios.get(
		`http://registry.npmjs.com/-/v1/search?text=keywords:${keywords.join(
			','
		)}&size=${resultCount || 20}`
	)
	return result.data.objects
}
