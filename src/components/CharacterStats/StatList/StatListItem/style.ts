import styled from '@style/styled-components'

export const StatListItemContainer = styled.div`
	& .summary {
		padding: 0 1.6rem;

		display: flex;
		justify-content: space-between;

		& .content {
			display: flex;
			justify-content: space-between;
			width: 100%;

			& img {
				margin-right: 1rem;
				vertical-align: middle;
			}
		}
	}

	& .details {
		flex-direction: column;
		padding-left: 4.5rem;
		padding-right: 5rem;

		& > div {
			display: flex;
			justify-content: space-between;
		}
	}
`
