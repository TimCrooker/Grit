import { Heading } from '@/components/core'
import React from 'react'
import { HomeCallToAction } from '../components'
import { GetStartedWrapper } from './style'

function GetStarted(): React.ReactElement {
	return (
		<GetStartedWrapper background="dark">
			<div className="content">
				<Heading text="Give it a try" />
				<ol className="steps">
					<li>
						<p>Run this</p>
						<div className="terminal">
							<code>npx perfect-boilerplate MyTestApp</code>
						</div>
					</li>
					<li>
						<p>Read these</p>
						<HomeCallToAction />
					</li>
				</ol>
			</div>
		</GetStartedWrapper>
	)
}

export default GetStarted
