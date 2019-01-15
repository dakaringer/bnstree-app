import styled from '@style/styled-components'
import { Input, Select } from '@material-ui/core'

export const SearchInputComponent = styled(Input as React.FunctionComponent<GetComponentProps<typeof Input>>).attrs({
	type: 'search',
	margin: 'dense',
	disableUnderline: true
})`
	width: 100%;
	background: black;
	border-radius: 1em;
	overflow: hidden;

	& input {
		padding: 0.6rem 1.5rem;
		padding-right: 0;
		font-size: 1.4rem;
	}
`

export const RegionSelect = styled(Select as React.FunctionComponent<GetComponentProps<typeof Select>>).attrs({
	disableUnderline: true
})`
	display: flex;
	align-items: center;

	& > div > div {
		font-size: 1.2rem;
		color: ${props => props.theme.palette.textSecondary};
		padding-left: 1rem;
		padding-right: 2rem;
		display: flex;
		align-items: center;
	}

	& svg {
		font-size: 1.4rem;
		top: 50%;
		right: 0.3rem;
		transform: translateY(-50%);
	}
`

export const RegionSelectMenuItem = styled.li`
	font-size: 1.2rem;
	padding: 0.3rem 1rem;
`
