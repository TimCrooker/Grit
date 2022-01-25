import { ActionButton, Heading } from '@/components/core'
import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import { HomeCallToAction } from '../components'
import { GetStartedWrapper } from './style'

function GetStarted(): React.ReactElement {
	return (
		<GetStartedWrapper background="light">
			<div className="content">
				<Heading text="Give it a try" />
				<ol className="steps">
					<li>
						<p>Run this</p>
						<div className="terminal">
							<code>npx grit-cli run example</code>
						</div>
					</li>
					<li>
						<p>Read this</p>
						<ActionButton
							type="secondary"
							href={useBaseUrl('docs/getting-started#jump-into-grit')}
							target="_self"
						>
							Usage
						</ActionButton>
					</li>
				</ol>
			</div>
		</GetStartedWrapper>
	)
}

export default GetStarted
