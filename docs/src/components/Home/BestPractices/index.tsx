import { TwoColumns } from '@/components/core'
import React from 'react'
import { BestPracticesWrapper } from './style'

function BestPractices(): React.ReactElement {
	return (
		<BestPracticesWrapper>
			<TwoColumns
				columnOne={<div>best practices</div>}
				columnTwo={<div>best practices column 2</div>}
			/>
		</BestPracticesWrapper>
	)
}

export default BestPractices
