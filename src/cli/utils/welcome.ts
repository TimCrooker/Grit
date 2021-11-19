import { APP_NAME } from '@/config'
import figlet from 'figlet'

export const bannerText = (text: string): void =>
	console.log(
		figlet.textSync(text.toUpperCase() as string, {
			horizontalLayout: 'fitted',
		})
	)

const welcomeMessage = (): void => {
	console.log()
	bannerText(APP_NAME)
	console.log()
	console.log('Welcome to the project scaffolding tool of the future!')
}

export const getWelcomeMessage = (NewUser: boolean): void => {
	if (NewUser) {
		welcomeMessage()
	}
}
