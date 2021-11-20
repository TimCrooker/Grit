import {
	CheckboxPrompt,
	ConfirmPrompt,
	InputPrompt,
	ListPrompt,
	NumberPrompt,
	PasswordPrompt,
	Prompt,
} from '../prompt'

type RemovePromptType<T extends Prompt> = Omit<T, 'type'>

/** Simple type-safe creation of prompts */
export class CreatePrompt {
	static input(action: RemovePromptType<InputPrompt>): InputPrompt {
		return {
			...action,
			type: 'input',
		}
	}

	static password(action: RemovePromptType<PasswordPrompt>): PasswordPrompt {
		return {
			...action,
			type: 'password',
		}
	}

	static number(action: RemovePromptType<NumberPrompt>): NumberPrompt {
		return {
			...action,
			type: 'number',
		}
	}

	static confirm(action: RemovePromptType<ConfirmPrompt>): ConfirmPrompt {
		return {
			...action,
			type: 'confirm',
		}
	}

	static checkbox(action: RemovePromptType<CheckboxPrompt>): CheckboxPrompt {
		return {
			...action,
			type: 'checkbox',
		}
	}

	static list(action: RemovePromptType<ListPrompt>): ListPrompt {
		return {
			...action,
			type: 'list',
		}
	}
}

