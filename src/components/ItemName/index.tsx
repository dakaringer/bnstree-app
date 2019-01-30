import React from 'react'
import { Typography } from '@material-ui/core'
import { API_SERVER, STATIC_SERVER } from '@utils/constants'

import ImageLoader from '@components/ImageLoader'

import { ItemNameContainer } from './style'

interface Props {
	name: React.ReactNode
	grade: string | number
	icon?: string
	fromNc?: string
	className?: string
	variant?: GetComponentProps<typeof Typography>['variant']
}

const ItemName: React.FC<Props> = props => {
	const { name, icon, grade, fromNc, className, variant } = props

	return (
		<ItemNameContainer grade={typeof grade === 'number' ? `grade_${grade}` : grade} className={className}>
			{icon &&
				(() => {
					const iconSrc = fromNc
						? `${API_SERVER}/proxy/${fromNc}/resource_img/${icon}`
						: `${STATIC_SERVER}/images/items/${icon}`

					return <ImageLoader src={icon !== 'none' ? iconSrc : ''} />
				})()}
			<Typography variant={variant || 'inherit'} color="inherit" component="span" inline>
				{name}
			</Typography>
		</ItemNameContainer>
	)
}

export default ItemName
