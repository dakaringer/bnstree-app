import styled from '@style/styled-components'

export const ItemNameContainer = styled.span<{ grade: string }>`
	display: inline-flex;
	align-items: center;
	max-width: 100%;

	color: ${props => {
		switch (props.grade) {
			case 'grade_1':
				return '#6c6c6c'
			case 'grade_2':
				return '#3f3f3f'
			case 'grade_3':
				return '#008746'
			case 'grade_4':
				return '#297bb0'
			case 'grade_5':
				return '#a847bd'
			case 'grade_6':
				return '#dd9000'
			case 'grade_7':
				return '#ed6900'
			case 'grade_8':
				return '#6756e1'
			default:
				return '#999'
		}
	}};

	& span {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	& img {
		height: 1.2em;
		width: 1.2em;
		margin-right: 0.3em;
		vertical-align: middle;
	}
`
