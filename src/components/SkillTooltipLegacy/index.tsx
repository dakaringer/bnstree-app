import React from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { IS_DEV, STATIC_SERVER } from '@utils/constants'

import HoverTooltip from '@components/HoverTooltip'
import T from '@components/T'
import Attribute from '@components/AttributeLegacy'
import Cost from './Cost'
import Info from './Info'
import Tags from './Tags'

import { RootState, SkillElement } from '@store'
import { MoveData } from '@store/SkillsLegacy'
import { selectors as resourceSelectors } from '@store/Resources'
import { selectors as intlSelectors } from '@store/Intl'

import { TooltipTitle } from './style'
import getAttributes from './getAttributes'

interface PropsFromStore {
	resource: ReturnType<typeof resourceSelectors.getResource>['skill']
	locale: ReturnType<typeof intlSelectors.getLocale>
}

interface Props extends PropsFromStore {
	currentMoveData: DeepReadonly<MoveData>
	hoverMoveData: DeepReadonly<MoveData>
	element: SkillElement
	target: React.ReactElement<any>
}

const SkillTooltip: React.FC<Props> = props => {
	const { element, currentMoveData, hoverMoveData, resource, locale, ...tooltipProps } = props

	const moveNumber = hoverMoveData.move
	const move = moveNumber > 3 ? moveNumber - 3 : moveNumber

	const title = (
		<TooltipTitle>
			<div>
				<Typography variant="subtitle1" className="skill" inline>
					{hoverMoveData.name}
				</Typography>
				{IS_DEV && (
					<Typography color="secondary" inline>
						{' '}
						{hoverMoveData.id}
					</Typography>
				)}
				<Typography color="textSecondary" inline>
					{' '}
					<T id={hoverMoveData.move > 3 ? 'skill.general.move_hm' : 'skill.general.move'} values={{ move }} />
				</Typography>
			</div>
			<Typography>
				{Cost(currentMoveData.focus || 0, hoverMoveData.focus || 0)}
				{Cost(currentMoveData.health || 0, hoverMoveData.health || 0, 'health')}
			</Typography>
		</TooltipTitle>
	)

	const { m1, m2, sub } = getAttributes(currentMoveData.attributes || [], hoverMoveData.attributes || [], element)

	const info =
		currentMoveData.info && hoverMoveData.info ? Info(currentMoveData.info, hoverMoveData.info, element) : null

	const stanceChange = getAttributes(
		currentMoveData.stance_change || [],
		hoverMoveData.stance_change || [],
		element,
		'buff_debuff_icon_08_53'
	).sub

	const requirements = getAttributes(
		currentMoveData.requirements || [],
		hoverMoveData.requirements || [],
		element,
		'buff_debuff_icon_08_53'
	).sub

	const tags = Tags(currentMoveData.tags || [], hoverMoveData.tags || [])

	return (
		<HoverTooltip
			icon={`${STATIC_SERVER}/images/skills/${hoverMoveData.icon}`}
			title={title}
			m1={m1}
			m2={m2}
			sub={sub}
			extra={
				<>
					{info}
					{stanceChange.length > 0 && (
						<div>
							<Typography variant="caption" color="secondary">
								<T id="tooltip.general.stance_change" />
							</Typography>
							<Typography variant="caption" color="inherit">
								{stanceChange}
							</Typography>
						</div>
					)}
					{requirements.length > 0 && (
						<div>
							<Typography variant="caption" color="secondary">
								<T id="tooltip.general.requirements" />
							</Typography>
							<Typography variant="caption" color="inherit">
								{requirements}
							</Typography>
						</div>
					)}
					{hoverMoveData.unlock && (
						<div>
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
			{...tooltipProps}
		/>
	)
}

const mapStateToProps = (state: RootState) => ({
	resource: resourceSelectors.getResource(state).skill,
	locale: intlSelectors.getLocale(state)
})

export default connect(mapStateToProps)(SkillTooltip)
