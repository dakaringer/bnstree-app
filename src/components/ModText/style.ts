import styled, { css } from '@style/styled-components'

export const ModTextContainer = styled.span<{ flag?: 'add' | 'mod' | 'del' }>`
	${props => {
		switch (props.flag) {
			case 'add':
				return css`
					color: #66ff66;
				`
			case 'mod':
				return css`
					color: #ffdf33;
				`
			case 'del':
				return css`
					color: #757575;
					text-decoration: line-through;
				`
		}
	}}
`
