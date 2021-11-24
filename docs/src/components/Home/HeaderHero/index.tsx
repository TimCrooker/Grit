import React from 'react'
import { HomeCallToAction } from '../components'
import { HeaderHeroWrapper } from './styles'

function HeaderHero(): React.ReactElement {
	return (
		<HeaderHeroWrapper background="light">
			<div className="wrapper">
				<h1 className="title">
					Write <span className="code-text">{'<Code />'}</span>
					{' Not'} <span className="boilerplate-text">Boilerplate</span>
				</h1>
				<p className="subtitle">
					Perfectplate is a simple, modular project generation CLI that builds
					and configures your web application infrestructure in seconds.
				</p>
				<div className="buttons">
					<HomeCallToAction />
				</div>
			</div>
		</HeaderHeroWrapper>
	)
}

export default HeaderHero
