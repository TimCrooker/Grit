import React from 'react'

export const Container = ({
	children,
}: {
	children: React.ReactElement | React.ReactElement[]
}): React.ReactElement => {
	return <div className="min-h-screen flex flex-col">{children}</div>
}
