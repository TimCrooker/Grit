import React from 'react'
import { withKnobs, select } from '@storybook/addon-knobs'

import { Button as ScssButton } from './index'

export default {
	title: 'Button',
	component: ScssButton,
	decorators: [withKnobs],
}

export const Basic = (): React.ReactElement => <ScssButton>Submit</ScssButton>

export const DynamicVariables = (): React.ReactElement => {
	const label = select('label', ['Submit', 'Cancel'], 'Docs')
	return <ScssButton>{label}</ScssButton>
}
