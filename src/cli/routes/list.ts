import inquirer from 'inquirer'
import Choice from 'inquirer/lib/objects/choice'
import { Grit } from '../..'
import { NpmGenerator, RepoGenerator } from '../../generator/parseGenerator'
import { colors } from '../../logger'
import { store } from '../../store'
import { GritRoute } from '../cli'
import { checkGeneratorForUpdates } from '../updater'

export const list: GritRoute = async (app, { args, options }) => {
	const defaultChoices = [
		{
			name: 'Installed',
			value: 'install',
		},
		{
			name: 'Find some help',
			value: 'help',
		},
		{
			name: 'Get me out of here!',
			value: 'exit',
		},
	] as Choice[]

	const generatorList: {
		name: string
		value: { method: string; generator: NpmGenerator | RepoGenerator }
	}[] = []

	store.generators.generatorNameList.forEach((generator, name) => {
		const updateInfo = checkGeneratorForUpdates(generator)
		if (updateInfo) {
			generatorList.push({
				name: `${name} ${colors.yellow('**Update Available**')} ${
					updateInfo.current
				} => ${updateInfo.latest}`,
				value: {
					method: 'update',
					generator,
				},
			})
		} else {
			generatorList.push({
				name: `${name} ${colors.yellow(generator.version)}`,
				value: { method: 'run', generator },
			})
		}
	})

	const answers = await app.prompt([
		{
			name: 'whatNext',
			type: 'list',
			message: `What would you like to do?`,
			choices: [
				new inquirer.Separator('Run a generator'),
				...generatorList,
				new inquirer.Separator(),
				...defaultChoices,
				new inquirer.Separator(),
			],
		},
	])

	if (answers.whatNext.method === 'run') {
		await new Grit({ generator: answers.whatNext.generator }).run()
	}

	if (answers.whatNext === 'exit') {
		await app.navigate('exit')
	}
}
