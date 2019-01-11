import * as React from 'react'
import { Typography } from '@material-ui/core'
import BTTooltip from '@src/components/BTTooltip'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { SkillSpecialization, ClassCode } from '@src/store/constants'
import { SkillData } from '@src/store/Skills/types'

import { STATIC_SERVER } from '@src/constants'
import style from './styles/index.css'
import Cost from './Cost'
import Attributes from './Attributes'
import Info from './Info'
import Tags from './Tags'

interface Props {
	id?: string
	currentMoveData: DeepReadonly<SkillData>
	hoverMoveData?: DeepReadonly<SkillData>
	specialization: SkillSpecialization<ClassCode>
	target: React.ReactElement<any>
	offset?: number | string
}

const SkillTooltip: React.SFC<Props> = props => {
	const { id, specialization, currentMoveData, hoverMoveData: hoverData, target, offset, children } = props
	const tooltipProps = {
		target,
		offset,
		children
	}
	let hoverMoveData = hoverData

	if (!hoverMoveData) {
		hoverMoveData = currentMoveData
	}

	const { m1, m2, sub } = Attributes(currentMoveData.attributes || [], hoverMoveData.attributes || [], specialization)

	const info = currentMoveData.info && hoverMoveData.info ? Info(currentMoveData.info, hoverMoveData.info) : null

	const stanceChange = Attributes(
		currentMoveData.stance_change || [],
		hoverMoveData.stance_change || [],
		specialization,
		'buff_debuff_icon_08_53'
	).sub

	const requirements = Attributes(
		currentMoveData.requirements || [],
		hoverMoveData.requirements || [],
		specialization,
		'buff_debuff_icon_08_53'
	).sub

	const tags = Tags(currentMoveData.tags || [], hoverMoveData.tags || [])

	return (
		<BTTooltip
			icon={`${STATIC_SERVER}/images/skills/${hoverMoveData.icon}`}
			title={
				<div className={style.title}>
					<Typography variant="subtitle1" className={style.skill}>
						{hoverMoveData.name}
						{process.env.NODE_ENV !== 'production' && id && (
							<Typography color="secondary"> {id}</Typography>
						)}
					</Typography>
					<Typography color="textSecondary">
						{Cost(currentMoveData.focus || 0, hoverMoveData.focus || 0)}
						{Cost(currentMoveData.health || 0, hoverMoveData.health || 0, 'health')}
					</Typography>
				</div>
			}
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
					{tags}
				</>
			}
			className={style.skillTooltip}
			{...tooltipProps}
		/>
	)
}

export default React.memo(SkillTooltip)
