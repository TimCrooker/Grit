import { PluginFileConfig } from 'gritenv'

export type App = {
	import: Array<string>
	inner: Array<string>
	wrapper: Array<string>[]
}

export type Docs = {
	import: Array<string>
	inner: Array<string>
	wrapper: Array<string>[]
}

export type TestSetup = {
	import: Array<string>
	inner: Array<string>
	wrapper: Array<string>[]
}

export type Base = {
	_app: Partial<App>
	_docs: Partial<Docs>
	testSetup: Partial<TestSetup>
}

export type PluginConfig = PluginFileConfig<Base>
