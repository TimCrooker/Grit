import { DataProvider } from '@/generator/data'
import { Prompt } from '@/generator/prompts'

export const addPluginData = async (
	prompts: Prompt[],
	answers: Record<string, any>
): Promise<DataProvider> => {
	// get the list of prompts where it is of type list or chekcbox and plugin property is set to true
	const pluginPrompts = prompts.filter((prompt) => {
		if (prompt.type === 'list' || prompt.type === 'checkbox')
			return prompt.plugin === true
	})

	// get answers where the key is equal to the name of a propmt in pluginPrompts
	const pluginAnswers = pluginPrompts.reduce((acc, prompt) => {
		acc[prompt.name] = answers[prompt.name]
		return acc
	}, {})

	// get an array of plugins from the pluginAnswers values
	const plugins = Object.entries(pluginAnswers).reduce(
		(acc: string[], [key, value]) => {
			if (typeof value === 'boolean' && value) return [...acc, key]
			if (typeof value === 'string') return [...(acc as string[]), value]
			if (Array.isArray(value)) return [...(acc as string[]), ...value]
			return acc
		},
		[]
	)

	// get the extend function from the pluginData.pluginFileData
	// const extend = this.pluginData.reduce((acc, plugin) => {
	// 	acc[plugin.name] = plugin.pluginFileData.extend(this.grit.answers)
	// 	return acc
	// }, {})

	return (): Record<string, any> => ({
		// ...extendData,
		selectedPlugins: plugins,
	})
}
