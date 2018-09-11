import * as React from 'react'
import { Typography, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import BTTooltip from '@src/components/BTTooltip'
import { DeepReadonly } from '@src/utils/immutableHelper'

import { ItemData } from '@src/store/Items/types'

import * as style from './styles/index.css'
import { STATIC_SERVER } from '@src/constants'
import Attributes from './Attributes'

interface SelfProps {
	itemData: DeepReadonly<ItemData>
	target: React.ReactElement<any>
}

interface Props extends SelfProps, WithWidth {}

const ItemTooltip: React.SFC<Props> = props => {
	const { itemData, width, ...tooltipProps } = props

	const { m1, m2, sub } = Attributes(itemData.attributes || [])

	return (
		<BTTooltip
			icon={`${STATIC_SERVER}/images/items/${itemData.icon}`}
			title={
				<div className={style.title}>
					<Typography
						variant={isWidthDown('xs', width) ? 'subheading' : 'title'}
						className={style[`grade_${itemData.grade}`]}>
						{itemData.name}
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

export default withWidth()(ItemTooltip)
