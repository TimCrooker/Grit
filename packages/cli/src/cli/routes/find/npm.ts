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
	const url = new URL('http://registry.npmjs.com/-/v1/search')
	const params = new URLSearchParams({
		text: `keywords:${keywords.join(',')}`,
		size: `${resultCount || 20}`,
	})
	url.search = params.toString()

	const result: NpmSearchResult = await axios.get(url.toString())
	return result.data.objects
}
