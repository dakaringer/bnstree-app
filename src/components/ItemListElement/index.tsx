import * as React from 'react'
import { connect } from 'react-redux'
import { Paper, Typography, ButtonBase } from '@material-ui/core'
import ImageLoader from '@src/components/ImageLoader'
import T from '@src/components/T'
import ItemTooltip from '@src/components/ItemTooltip'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { RootState } from '@src/store/rootReducer'
import { ItemData } from '@src/store/Items/types'
import { getLocale } from '@src/store/Intl/selectors'
import { getResource } from '@src/store/Resources/selectors'

import * as style from './styles/index.css'
import classIcons from '@src/images/classIcons'
import { STATIC_SERVER } from '@src/constants'

interface PropsFromStore {
	resource: ReturnType<typeof getResource>['item']
	locale: ReturnType<typeof getLocale>
}

interface Props extends PropsFromStore {
	itemData: DeepReadonly<ItemData>
}

class ItemListElement extends React.PureComponent<Props> {
	render() {
		const { itemData, resource, locale } = this.props

		const nameData = resource[itemData.name]
		if (!nameData) {
			console.error(`[BnSTree] Missing item name data: "${itemData.name}"`)
			return null
		}

		return (
			<Paper className={style.itemListElement}>
				<div className={style.iconContainer}>
					<ItemTooltip
						itemData={itemData}
						target={
							<ButtonBase className={style.icon}>
								<ImageLoader src={`${STATIC_SERVER}/images/items/${nameData.icon}`} />
							</ButtonBase>
						}
					/>
				</div>
				<div>
					<Typography variant="subheading" color="inherit" className={style[`grade_${itemData.grade}`]}>
						{nameData.name[locale]}
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

const mapStateToProps = (state: RootState) => {
	return {
		resource: getResource(state).item,
		locale: getLocale(state)
	}
}

export default connect(mapStateToProps)(ItemListElement)
