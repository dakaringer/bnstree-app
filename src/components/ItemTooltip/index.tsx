import * as React from 'react'
import { connect } from 'react-redux'
import { Typography, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import BTTooltip from '@src/components/BTTooltip'
import compose from '@src/utils/compose'
import { DeepReadonly } from '@src/utils/immutableHelper'

import { RootState } from '@src/store/rootReducer'
import { ItemData } from '@src/store/Items/types'
import { getResource } from '@src/store/Resources/selectors'
import { getLocale } from '@src/store/Intl/selectors'

import * as style from './styles/index.css'
import { STATIC_SERVER } from '@src/constants'
import Attributes from './Attributes'

interface PropsFromStore {
	resource: ReturnType<typeof getResource>['item']
	locale: ReturnType<typeof getLocale>
}

interface SelfProps {
	itemData: DeepReadonly<ItemData>
	target: React.ReactElement<any>
}

interface Props extends SelfProps, PropsFromStore, WithWidth {}

const ItemTooltip: React.SFC<Props> = props => {
	const { itemData, resource, locale, width, ...tooltipProps } = props

	const nameData = resource[itemData.name]
	if (!nameData) return null

	const { m1, m2, sub } = Attributes(itemData.attributes || [])

	return (
		<BTTooltip
			icon={`${STATIC_SERVER}/images/items/${nameData.icon}`}
			title={
				<div className={style.title}>
					<Typography
						variant={isWidthDown('xs', width) ? 'subheading' : 'title'}
						className={style[`grade_${itemData.grade}`]}>
						{nameData.name[locale]}
					</Typography>
				</div>
			}
			m1={m1}
			m2={m2}
			sub={sub}
			className={style.itemTooltip}
			{...tooltipProps}
		/>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		resource: getResource(state).item,
		locale: getLocale(state)
	}
}

export default compose<Props, SelfProps>(
	withWidth(),
	connect(mapStateToProps)
)(ItemTooltip)
