import React from 'react'
import { connect } from 'react-redux'
import { Typography, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import compose from '@utils/compose'
import { STATIC_SERVER } from '@utils/constants'

import T from '@components/T'
import HoverTooltip from '@components/HoverTooltip'
import ItemName from '@components/ItemName'

import { RootState } from '@store'
import { ItemData } from '@store/Items'
import { selectors as resourceSelectors } from '@store/Resources'
import { selectors as intlSelectors } from '@store/Intl'

import { TooltipTitle } from './style'
import getAttributes from './getAttributes'

interface PropsFromStore {
	resource: ReturnType<typeof resourceSelectors.getResource>
	locale: ReturnType<typeof intlSelectors.getLocale>
}

interface SelfProps {
	itemData: DeepReadonly<ItemData>
	target: React.ReactElement<any>
}

interface Props extends SelfProps, PropsFromStore, WithWidth {}

const ItemTooltip: React.FC<Props> = props => {
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
			button
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
			{...tooltipProps}
		/>
	)
}

const mapStateToProps = (state: RootState) => ({
	resource: resourceSelectors.getResource(state),
	locale: intlSelectors.getLocale(state)
})

export default compose<Props, SelfProps>(
	withWidth(),
	connect(mapStateToProps)
)(ItemTooltip)
