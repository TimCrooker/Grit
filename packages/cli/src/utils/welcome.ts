import { cli } from '@/cli/config'
import figlet from 'figlet'

export const bannerText = (text: string): void =>
	console.log(
		figlet.textSync(text.toUpperCase() as string, {
			horizontalLayout: 'fitted',
		})
	)

const welcomeMessage = (): void => {
	console.log(
		cli.colors.green('Welcome to the project scaffolding tool of the future!')
	)
	console.log()
	bannerText('Grit')
	console.log()
}

export const getWelcomeMessage = (showMessage: boolean): void => {
	if (showMessage) {
		welcomeMessage()
	}
}
