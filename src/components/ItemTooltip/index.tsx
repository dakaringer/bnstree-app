import * as React from 'react'
import { connect } from 'react-redux'
import { Typography, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import { DeepReadonly } from '@src/utils/immutableHelper'
import compose from '@src/utils/compose'
import BTTooltip from '@src/components/BTTooltip'
import T from '@src/components/T'
import ImageLoader from '@src/components/ImageLoader'

import { ItemData } from '@src/store/Items/types'
import { RootState } from '@src/store/rootReducer'
import { getResource } from '@src/store/Resources/selectors'
import { getLocale } from '@src/store/Intl/selectors'

import * as style from './styles/index.css'
import { STATIC_SERVER } from '@src/constants'
import Attributes from './Attributes'

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

	const { m1, m2, sub } = Attributes(itemData.attributes || [])

	const extra = []
	if (itemData.fuse) {
		extra.push(
			<div className={style.fuse} key="fuse">
				<Typography variant="caption" color="secondary">
					<T id="tooltip.general.fuse" />
				</Typography>
				<Typography variant="caption" color="inherit" className={style.badges}>
					{itemData.fuse.map((badge, i) => {
						const item = resource.item[badge]
						return (
							<span key={badge}>
								<span className={style.grade_5}>
									<ImageLoader src={`${STATIC_SERVER}/images/items/${item.icon}`} />
									{item.name[locale]}
								</span>
								{itemData.fuse && i !== itemData.fuse.length - 1 && (
									<span className={style.plus}> + </span>
								)}
							</span>
						)
					})}
				</Typography>
			</div>
		)
	}

	return (
		<BTTooltip
			icon={`${STATIC_SERVER}/images/items/${itemData.icon}`}
			title={
				<div className={style.title}>
					<Typography
						variant={isWidthDown('xs', width) ? 'subtitle1' : 'h6'}
						className={style[`grade_${itemData.grade}`]}>
						{itemData.name}
					</Typography>
				</div>
			}
			m1={m1}
			m2={m2}
			sub={sub}
			extra={<>{extra}</>}
			className={style.itemTooltip}
			offset={-3}
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
