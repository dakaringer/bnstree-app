import * as React from 'react'
import { connect } from 'react-redux'
import { Typography, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import BTTooltip from '@src/components/BTTooltip'
import T from '@src/components/T'
import Attribute from '@src/components/Attribute'
import compose from '@src/utils/compose'
import { DeepReadonly } from '@src/utils/immutableHelper'

import { RootState } from '@src/store/rootReducer'
import { SkillElement } from '@src/store/constants'
import { MoveData } from '@src/store/Skills/types'
import { getResource } from '@src/store/Resources/selectors'
import { getLocale } from '@src/store/Intl/selectors'

import * as style from './styles/index.css'
import { STATIC_SERVER } from '@src/constants'
import Cost from './Cost'
import Attributes from './Attributes'
import Info from './Info'
import Tags from './Tags'

interface PropsFromStore {
	resource: ReturnType<typeof getResource>['skill']
	locale: ReturnType<typeof getLocale>
}

interface SelfProps {
	currentMoveData: DeepReadonly<MoveData>
	hoverMoveData: DeepReadonly<MoveData>
	element: SkillElement
	target: React.ReactElement<any>
}

interface Props extends SelfProps, PropsFromStore, WithWidth {}

const SkillTooltip: React.SFC<Props> = props => {
	const { element, currentMoveData, hoverMoveData, resource, locale, width, ...tooltipProps } = props

	const moveNumber = hoverMoveData.move
	const move = moveNumber > 3 ? moveNumber - 3 : moveNumber

	const title = (
		<div className={style.title}>
			<Typography variant={isWidthDown('xs', width) ? 'subtitle1' : 'h6'} className={style.skill}>
				{hoverMoveData.name}
				{process.env.NODE_ENV !== 'production' && <Typography color="secondary">{hoverMoveData.id}</Typography>}
				<Typography color="textSecondary" className={style.move}>
					<T id={hoverMoveData.move > 3 ? 'skill.general.move_hm' : 'skill.general.move'} values={{ move }} />
				</Typography>
			</Typography>
			<Typography color="textSecondary">
				{Cost(currentMoveData.focus || 0, hoverMoveData.focus || 0)}
				{Cost(currentMoveData.health || 0, hoverMoveData.health || 0, 'health')}
			</Typography>
		</div>
	)

	const { m1, m2, sub } = Attributes(currentMoveData.attributes || [], hoverMoveData.attributes || [], element)

	const info =
		currentMoveData.info && hoverMoveData.info ? Info(currentMoveData.info, hoverMoveData.info, element) : null

	const stanceChange = Attributes(
		currentMoveData.stance_change || [],
		hoverMoveData.stance_change || [],
		element,
		'buff_debuff_icon_08_53'
	).sub

	const requirements = Attributes(
		currentMoveData.requirements || [],
		hoverMoveData.requirements || [],
		element,
		'buff_debuff_icon_08_53'
	).sub

	const tags = Tags(currentMoveData.tags || [], hoverMoveData.tags || [])

	return (
		<BTTooltip
			icon={`${STATIC_SERVER}/images/skills/${hoverMoveData.icon}`}
			title={title}
			m1={m1}
			m2={m2}
			sub={sub}
			extra={
				<>
					{info}
					{stanceChange.length > 0 && (
						<div className={style.requirements}>
							<Typography variant="caption" color="secondary">
								<T id="tooltip.general.stance_change" />
							</Typography>
							<Typography variant="caption" color="inherit">
								{stanceChange}
							</Typography>
						</div>
					)}
					{requirements.length > 0 && (
						<div className={style.requirements}>
							<Typography variant="caption" color="secondary">
								<T id="tooltip.general.requirements" />
							</Typography>
							<Typography variant="caption" color="inherit">
								{requirements}
							</Typography>
						</div>
					)}
					{hoverMoveData.unlock && (
						<div className={style.requirements}>
							<Typography variant="caption" color="secondary">
								<T id="tooltip.general.unlock_hm" />
							</Typography>
							<Typography variant="caption" color="inherit">
								<Attribute
									attribute={{
										msg: `unlock.${hoverMoveData.unlock.type}`,
										values: {
											skillName: hoverMoveData.unlock.skillName || hoverMoveData.name
										},
										icon: 'achievement'
									}}
									defaultElement={element}
								/>
							</Typography>
						</div>
					)}
					{tags}
				</>
			}
			className={style.skillTooltip}
			{...tooltipProps}
		/>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		resource: getResource(state).skill,
		locale: getLocale(state)
	}
}

export default compose<Props, SelfProps>(
	withWidth(),
	connect(mapStateToProps)
)(SkillTooltip)
