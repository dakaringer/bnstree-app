import * as React from 'react'
import { Paper, Typography, ButtonBase } from '@material-ui/core'
import ImageLoader from '@src/components/ImageLoader'
import T from '@src/components/T'
import ItemTooltip from '@src/components/ItemTooltip'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { ItemData } from '@src/store/Items/types'

import * as style from './styles/index.css'
import classIcons from '@src/images/classIcons'
import { STATIC_SERVER } from '@src/constants'

interface Props {
	itemData: DeepReadonly<ItemData>
}

class ItemListElement extends React.PureComponent<Props> {
	render() {
		const { itemData } = this.props

		return (
			<Paper className={style.itemListElement}>
				<div className={style.iconContainer}>
					<ItemTooltip
						itemData={itemData}
						target={
							<ButtonBase className={style.icon}>
								<ImageLoader src={`${STATIC_SERVER}/images/items/${itemData.icon}`} />
							</ButtonBase>
						}
					/>
				</div>
				<div>
					<Typography variant="subheading" color="inherit" className={style[`grade_${itemData.grade}`]}>
						{itemData.name}
					</Typography>
					{itemData.classCode && (
						<Typography color="textSecondary" className={style.class}>
							<ImageLoader src={classIcons[itemData.classCode]} />
							<T id={['general', 'class_names', itemData.classCode]} />
						</Typography>
					)}
				</div>
			</Paper>
		)
	}
}

export default ItemListElement
