/* eslint-disable prettier/prettier */
import styled from 'styled-components'
import { Section } from '../../core'

export const HeaderHeroWrapper = styled(Section)`
padding: 100px 24px 50px 24px;

.wrapper {
	max-width: 900px;
	margin: auto;
	display: flex;
	flex-direction: column;
	align-items: center;

	.super-image {
		min-width: 200px;
	}

	.socialLinks {
		display: flex;
		justify-content: flex-end;
		max-width: 1200px;
		margin: -10px auto 0;

		.twitter-follow-button,
		.github-button {
			margin-right: 1rem;
		}
	}

	.title {
		font-size: 4.2rem;
		color: var(--ifm-color-gray-800);
		line-height: 1;
		margin-top: 0;
		margin-bottom: 20px;
		font-weight: 900;
		text-align: center;

		.code-text {
			white-space: nowrap;
			color: var(--brand);
		}

		.boilerplate-text {
			color: var(--ifm-color-danger);
			position: relative;

			/* &::after {
				content: '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^';
				letter-spacing: -3px;
				font-size: 1rem;
				color: red;
				position: absolute;
				bottom: 10px;
				left: 0;
				height: 0;
				width: inherit;
			} */
		}
	}

	.subtitle {
		padding-top: 20px;
		max-width: 600px;
		text-align: center;
		font-size: 1.2rem;
		color: var(--ifm-color-gray-600);
	}

	.buttons {
		margin-top: 40px;
		display: flex;
		gap: 20px;
	}

	@media only screen and (max-width: 760px) {
		.title {
			font-size: 3.5rem;
		}
	}

	@media only screen and (max-width: 480px) {
		.buttons {
			width: 100%;
			flex-direction: column;
		}

		.title {
			font-size: 2.8rem;
		}

		.subtitle {
			font-size: 1.1rem;
		}
	}
}
}
`