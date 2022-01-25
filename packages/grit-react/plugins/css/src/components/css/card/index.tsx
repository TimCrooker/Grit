import React from 'react'
import './index.css'

type CardProps = {
	title: string
	children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
	return (
		<div className="card">
			<%_ if (features.includes("svgr")) {}%>
			<div className="header">{title}</div>
			<div>{children}</div>
		</div>
	)
}
