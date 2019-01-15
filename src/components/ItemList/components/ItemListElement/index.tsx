import * as React from 'react'
import { Paper, Typography } from '@material-ui/core'
import { STATIC_SERVER } from '@src/utils/constants'
import classIcons from '@src/images/classIcons'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import ItemTooltip from '@components/ItemTooltip'
import Virtualizer from '@components/Virtualizer'
import ItemName from '@components/ItemName'

import { ItemData } from '@store/Items/types'

import { ItemListElementContainer, ItemIcon, ClassLabel } from './style'

interface Props {
	itemData: DeepReadonly<ItemData>
}

const ItemListElement: React.SFC<Props> = props => {
	const { itemData } = props

	return (
		<Virtualizer minHeight="7.5rem">
			<Paper component={ItemListElementContainer}>
				<ItemIcon>
					<ItemTooltip
						itemData={itemData}
						target={<ImageLoader src={`${STATIC_SERVER}/images/items/${itemData.icon}`} />}
					/>
				</ItemIcon>
				<div>
					<Typography variant="subtitle1" color="inherit">
						<ItemName name={itemData.name} grade={itemData.grade} />
					</Typography>
					{itemData.classCode && (
						<ClassLabel>
							<ImageLoader src={classIcons[itemData.classCode]} />
							<Typography color="textSecondary" inline>
								<T id={['general', 'class_names', itemData.classCode]} />
							</Typography>
						</ClassLabel>
					)}
				</div>
			</Paper>
		</Virtualizer>
	)
}

export default React.memo(ItemListElement)
