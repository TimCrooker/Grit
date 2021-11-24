import styled from 'styled-components'
import { Section } from '../../core'

export const GetStartedWrapper = styled(Section)`
	color: white;

	p: {
		color: white;
	}

	.Heading {
		color: var(--brand);
		text-align: center;
	}

	.content {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
	}

	.steps {
		align-self: center;
	}

	.steps li {
		font-size: 28px;
		margin-bottom: 8px;
	}

	.steps li p {
		font-size: 17px;
	}

	.terminal {
		display: flex;
		flex-direction: column;
		border-left: 1px solid gray;
		border-right: 1px solid gray;
		border-top: 1px solid gray;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		padding: 30px 30px 0 30px;
		width: 600px;
		position: relative;
	}

	.terminal::before {
		content: '○ ○ ○';
		color: gray;
		font-size: 16px;
		position: absolute;
		left: 15px;
		top: 5px;
	}

	code {
		color: white;
		font-size: 18px;
		position: relative;
		background: none;
		border: 0;
	}

	code:first-child::before {
		content: '>';
		position: absolute;
		left: -13px;
		color: gray;
	}

	@media screen and (max-width: 760px) {
		.content {
			width: 80%;
		}

		.steps li {
			margin-left: -1rem;
		}

		.terminal {
			width: 100%;
		}
	}
`
