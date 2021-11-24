import { SuperImage } from '@/components/core'
import { databases, frameworks } from '@/features'
import React from 'react'
import { Feature as FeatureType } from '@/features'
import {
	BuildStackWrapper,
	FeatureGridWrapper,
	FeatureRowWrapper,
	FeatureWrapper,
} from './styles'

function Feature({
	feature,
	key,
}: {
	feature: FeatureType
	key: string | number
}) {
	return (
		<FeatureWrapper
			key={key}
			whileHover={{
				scale: 0.9,
			}}
			className="feature"
			href={feature.link}
			target="_blank"
		>
			<SuperImage
				alt={feature.title}
				publicId={feature.publicId}
				imageUrl={feature.imageUrl}
			/>
		</FeatureWrapper>
	)
}

function Features({
	features,
}: {
	features: FeatureType[]
}): React.ReactElement {
	return (
		<>
			{features?.map((feature, i) => {
				return <Feature key={i} feature={feature} />
			})}
		</>
	)
}

function FeatureGrid({
	features,
}: {
	features: FeatureType[]
}): React.ReactElement {
	return (
		<FeatureGridWrapper className="feature-grid">
			<Features features={features} />
		</FeatureGridWrapper>
	)
}

function FeatureRow({
	features,
}: {
	features: FeatureType[]
}): React.ReactElement {
	return (
		<FeatureRowWrapper className="feature-row">
			<Features features={features} />
		</FeatureRowWrapper>
	)
}

function BuildStack(): React.ReactElement {
	const techCombo = [...frameworks, ...databases]

	return (
		<BuildStackWrapper background="light">
			<div>
				<div>
					<h2 className="text--center">Build Your Tech stack</h2>
					{/* <p className="text--center">Build ANY stack</p> */}
				</div>

				<FeatureGrid features={techCombo} />
			</div>
		</BuildStackWrapper>
	)
}

export default BuildStack
