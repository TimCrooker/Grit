import React from 'react'
import { withKnobs } from '@storybook/addon-knobs'

import { Button } from './index'

export default {
	title: 'Button',
	component: Button,
	decorators: [withKnobs],
}

export const Basic = (): React.ReactElement => <Button>Button</Button>
