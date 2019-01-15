import * as React from 'react'
import { connect } from 'react-redux'
import { Typography, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import compose from '@src/utils/compose'
import { STATIC_SERVER } from '@src/utils/constants'

import T from '@components/T'
import HoverTooltip from '@components/HoverTooltip'
import ItemName from '@components/ItemName'

import { ItemData } from '@store/Items/types'
import { RootState } from '@store/rootReducer'
import { getResource } from '@store/Resources/selectors'
import { getLocale } from '@store/Intl/selectors'

import { TooltipTitle } from './style'
import getAttributes from './getAttributes'

interface PropsFromStore {
	resource: ReturnType<typeof getResource>
	locale: ReturnType<typeof getLocale>
}

interface SelfProps {
	itemData: DeepReadonly<ItemData>
	target: React.ReactElement<any>
}

interface Props extends SelfProps, PropsFromStore, WithWidth {}

const ItemTooltip: React.SFC<Props> = props => {
	const { itemData, width, resource, locale, ...tooltipProps } = props

	const { m1, m2, sub } = getAttributes(itemData.attributes || [])

	let fuse
	if (itemData.fuse) {
		fuse = (
			<div key="fuse">
				<Typography variant="caption" color="secondary">
					<T id="tooltip.general.fuse" />
				</Typography>
				<div>
					{itemData.fuse.map((badge, i) => {
						const item = resource.item[badge]
						return (
							<span key={badge}>
								<Typography variant="caption" color="inherit" inline>
									<ItemName name={item.name[locale]} grade={5} icon={item.icon} />
								</Typography>
								{itemData.fuse && i !== itemData.fuse.length - 1 && <span> + </span>}
							</span>
						)
					})}
				</div>
			</div>
		)
	}

	return (
		<HoverTooltip
			icon={`${STATIC_SERVER}/images/items/${itemData.icon}`}
			title={
				<TooltipTitle>
					<Typography variant={isWidthDown('xs', width) ? 'subtitle1' : 'h6'}>
						<ItemName name={itemData.name} grade={itemData.grade} />
					</Typography>
				</TooltipTitle>
			}
			m1={m1}
			m2={m2}
			sub={sub}
			extra={fuse}
			offset={-2}
			{...tooltipProps}
		/>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		resource: getResource(state),
		locale: getLocale(state)
	}
}

export default compose<Props, SelfProps>(
	withWidth(),
	connect(mapStateToProps)
)(React.memo(ItemTooltip))
