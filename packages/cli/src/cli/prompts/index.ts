/**********************METHODS**********************/

import { colors } from 'swaglog'
import inquirer from 'inquirer'

/**
 *
 */
const promptOutDir = async (): Promise<string> => {
	const { outputDir } = await inquirer.prompt([
		{
			type: 'input',
			name: 'outputDir',
			message: `Output directory? ${colors.gray(
				'leave blank to use current working directory'
			)}`,
			default: './',
		},
	])

	return outputDir as string
}

/**
 *
 */
const promptGeneratorUpdate = async (): Promise<boolean> => {
	const { update } = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'update',
			message: `Would you like to update the generator?`,
			default: 'true',
		},
	])

	return update as boolean
}

/**
 *
 */
const promptGeneratorRun = async (): Promise<boolean> => {
	const { run } = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'run',
			message: `Would you like to run the generator?`,
			default: 'true',
		},
	])

	return run as boolean
}

const promptConfirmAction = async (
	confirmMessage: string
): Promise<boolean> => {
	const { run } = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'run',
			message: `Are you sure you want to ${confirmMessage}?`,
			default: 'true',
		},
	])

	return run as boolean
}

/**********************EXPORTS**********************/

export {
	promptOutDir,
	promptGeneratorUpdate,
	promptGeneratorRun,
	promptConfirmAction,
}
