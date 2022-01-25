import { ActionButton } from '@/components/core'
import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'

export function HomeCallToAction(): React.ReactElement {
	return (
		<>
			<ActionButton
				type="primary"
				href={useBaseUrl('docs/getting-started')}
				target="_self"
			>
				Get started
			</ActionButton>
			<ActionButton
				type="secondary"
				href={useBaseUrl('docs/product-problem')}
				target="_self"
			>
				Learn more
			</ActionButton>
		</>
	)
}
