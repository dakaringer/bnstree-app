import React from 'react'
import { Typography } from '@material-ui/core'
import { IS_DEV, STATIC_SERVER } from '@utils/constants'

import T from '@components/T'
import HoverTooltip from '@components/HoverTooltip'
import SkillName from '@components/SkillName'
import ImageLoader from '@components/ImageLoader'
import Cost from './Cost'
import Info from './Info'
import Tags from './Tags'

import { SkillSpecialization, ClassCode } from '@store'
import { SkillData } from '@store/Skills'

import { TooltipTitle, SkillIcon } from './style'
import getAttributes from './getAttributes'

interface Props {
	id?: string
	currentMoveData: DeepReadonly<SkillData>
	hoverMoveData?: DeepReadonly<SkillData>
	specialization: SkillSpecialization<ClassCode>
	target: React.ReactElement<any>
}

const SkillTooltip: React.FC<Props> = props => {
	const { id, specialization, currentMoveData, hoverMoveData: hoverData, target, children } = props
	const tooltipProps = { target, children }
	let hoverMoveData = hoverData

	if (!hoverMoveData) {
		hoverMoveData = currentMoveData
	}

	const { m1, m2, sub } = getAttributes(
		currentMoveData.attributes || [],
		hoverMoveData.attributes || [],
		specialization
	)

	const info = currentMoveData.info && hoverMoveData.info ? Info(currentMoveData.info, hoverMoveData.info) : null

	const stanceChange = getAttributes(
		currentMoveData.stance_change || [],
		hoverMoveData.stance_change || [],
		specialization,
		'buff_debuff_icon_08_53'
	).sub

	const requirements = getAttributes(
		currentMoveData.requirements || [],
		hoverMoveData.requirements || [],
		specialization,
		'buff_debuff_icon_08_53'
	).sub

	const tags = Tags(currentMoveData.tags || [], hoverMoveData.tags || [])

	return (
		<HoverTooltip
			button
			icon={
				<SkillIcon>
					<ImageLoader src={`${STATIC_SERVER}/images/skills/${hoverMoveData.icon}`} />
					{hoverMoveData.hotkey !== 'NONE' && hoverMoveData.hotkey !== 'PASSIVE' && (
						<Typography>{hoverMoveData.hotkey.toLowerCase()}</Typography>
					)}
				</SkillIcon>
			}
			title={
				<TooltipTitle>
					<div>
						<SkillName name={hoverMoveData.name} variant="subtitle1" />
						{IS_DEV && id && (
							<Typography color="secondary" inline>
								{' '}
								{id}
							</Typography>
						)}
					</div>
					<Typography variant="caption">
						{Cost(currentMoveData.focus || 0, hoverMoveData.focus || 0)}
						{Cost(currentMoveData.health || 0, hoverMoveData.health || 0, 'health')}
					</Typography>
				</TooltipTitle>
			}
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
					{tags}
				</>
			}
			{...tooltipProps}
		/>
	)
}

export default SkillTooltip
