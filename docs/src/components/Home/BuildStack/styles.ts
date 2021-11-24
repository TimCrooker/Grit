import { Section } from '@/components/core'
import { motion } from 'framer-motion'
import styled from 'styled-components'

export const BuildStackWrapper = styled(Section)`
	margin-top: 100px;
	overflow: hidden;

	.feature-grid {
		margin: 0 auto;

		.feature {
			border-radius: 50%;
			padding: 16px;
			box-shadow:
				rgba(0, 0, 0, 0.02) 0 1px 3px 0,
				rgba(27, 31, 35, 0.15) 0 0 0 1px;

			.super-image {
				width: 100%;
			}
		}
	}

	@media only screen and (min-width: 997px) {
		.feature-grid {
			grid-template-columns: repeat(auto-fill, 180px);
			max-width: 80%;
		}
	}
`

export const FeatureWrapper = styled(motion.a)`
	width: 50px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
`

export const FeatureGridWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	align-items: center;
	justify-content: center;

	.feature {
		width: 75px;
		height: 75px;
		margin: 75px auto 0 auto;
	}

	@media only screen and (max-width: 997px) {
		grid-template-columns: repeat(4, 1fr);

		.feature {
			width: 50px;
			height: 50px;
			margin: 50px auto 0 auto;
		}
	}

	@media only screen and (max-width: 480px) {
		grid-template-columns: repeat(2, 1fr);

		.feature {
			width: 50px;
			height: 50px;
			margin: 50px auto 0 auto;
		}
	}
`

export const FeatureRowWrapper = styled.div`
	display: flex;

	.feature {
		flex-shrink: 0;
		margin: 32.5px;
		width: 75px;
		height: 75px;
	}
`
