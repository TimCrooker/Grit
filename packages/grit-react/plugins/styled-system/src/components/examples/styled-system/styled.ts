import styled from 'styled-components'
import {
	border,
	BorderProps,
	color,
	ColorProps,
	layout,
	LayoutProps,
	space,
	SpaceProps,
	typography,
	TypographyProps,
} from 'styled-system'

interface CardProps extends BorderProps, ColorProps, LayoutProps, SpaceProps {}
export const Card = styled.div<CardProps>`
	${border}
	${color}
  ${layout}
  ${space}
`

interface CardheaderProps extends BorderProps, SpaceProps {}
export const CardHeader = styled.header<CardheaderProps>`
	h2 {
		font-weight: 600;
	}

	${border}
	${space}
`

type CardContentProps = SpaceProps
export const CardContent = styled.main<CardContentProps>`
	p {
		margin-bottom: 1rem;
		color: darkslategrey;
	}

	${space}
`

interface CardFooterProps extends BorderProps, SpaceProps, TypographyProps {}
export const CardFooter = styled.footer<CardFooterProps>`
	${border}
	${space}
  ${typography}
`

interface ButtonProps
	extends BorderProps,
		ColorProps,
		SpaceProps,
		TypographyProps {}
export const Button = styled.a<ButtonProps>`
	text-decoration: none;

	${border}
	${color}
  ${space}
  ${typography}
`
