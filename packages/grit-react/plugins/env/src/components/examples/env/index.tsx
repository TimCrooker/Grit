export const EnvExample = (): React.ReactElement => {
	return (
		<div>
			<div>REACT_APP_ENV_VARIABLE</div>
			<div>{process.env.REACT_APP_ENV_VARIABLE}</div>
		</div>
	)
}
