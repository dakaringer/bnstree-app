import * as React from 'react'
import { Typography } from '@material-ui/core'
import { API_SERVER, STATIC_SERVER } from '@src/utils/constants'

import ImageLoader from '@components/ImageLoader'

import { ItemNameContainer } from './style'

interface Props {
	name: React.ReactNode
	grade: string | number
	icon?: string
	fromNc?: string
	className?: string
}

const ItemName: React.SFC<Props> = props => {
	const { name, icon, grade, fromNc, className } = props

	return (
		<ItemNameContainer grade={typeof grade === 'number' ? `grade_${grade}` : grade} className={className}>
			{icon &&
				(() => {
					const iconSrc = fromNc
						? `${API_SERVER}/proxy/${fromNc}/resource_img/${icon}`
						: `${STATIC_SERVER}/images/items/${icon}`

					return <ImageLoader src={icon !== 'none' ? iconSrc : ''} />
				})()}
			<Typography variant="inherit" component="span">
				{name}
			</Typography>
		</ItemNameContainer>
	)
}

export default React.memo(ItemName)
