import { DynamicQuestionProperty } from 'inquirer'
import Separator from 'inquirer/lib/objects/separator'
import { Answers } from './answers'

export type Choice = number | string | ListChoice | CheckboxChoice

export type Choices = Array<Choice | Separator>

/**
 * Represents a choice-item.
 */
interface ChoiceBase {
	/**
	 * The type of the choice.
	 */
	type?: string | undefined
}

/**
 * Provides options for a choice.
 */
interface ChoiceOptions extends ChoiceBase {
	/**
	 * @inheritdoc
	 */
	type?: 'choice' | undefined

	/**
	 * The name of the choice to show to the user.
	 */
	name: string

	/**
	 * The value of the choice.
	 */
	value: any

	/**
	 * The short form of the name of the choice.
	 */
	short?: string | undefined

	/**
	 * The extra properties of the choice.
	 */
	extra?: any
}

/**
 * Provides options for a choice of the `ListPrompt`.
 *
 * @template T
 * The type of the answers.
 */
export interface ListChoice<T extends Answers = Answers> extends ChoiceOptions {
	/**
	 * A value indicating whether the choice is disabled.
	 */
	disabled?: DynamicQuestionProperty<boolean | string, T> | undefined
}

/**
 * Provides options for a choice of the `CheckboxPrompt`.
 *
 * @template T
 * The type of the answers.
 */
export interface CheckboxChoice<T extends Answers = Answers>
	extends ListChoice<T> {
	/**
	 * A value indicating whether the choice should be initially checked.
	 */
	checked?: boolean | undefined
}
