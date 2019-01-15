import * as React from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { ArrowRight } from '@material-ui/icons'
import { getTags } from '@src/utils/helpers'

import T from '@components/T'
import SkillName from '@components/SkillName'
import SkillTooltip from '@components/SkillTooltip'

import { RootState } from '@store/rootReducer'
import { SkillSpecialization, ClassCode } from '@store/constants'
import { TraitSkill, SkillData } from '@store/Skills/types'
import { getData } from '@store/Skills/selectors'

import { TraitTooltipSkillContainer } from './style'

interface PropsFromStore {
	skillData: ReturnType<typeof getData>
}

interface Props extends PropsFromStore {
	traitSkill: DeepReadonly<TraitSkill>
	specialization: SkillSpecialization<ClassCode>
}

const TraitTooltipSkill: React.SFC<Props> = props => {
	const { traitSkill, specialization, skillData } = props

	let targetSkill = skillData.find(skill => traitSkill.skillId === skill._id)
	if (targetSkill) {
		targetSkill = {
			...targetSkill,
			data: {
				...targetSkill.data,
				tags: getTags(targetSkill.data)
			}
		}
	}

	return (
		<TraitTooltipSkillContainer>
			{!traitSkill.action &&
				(() => {
					if (!targetSkill || !traitSkill.data) {
						return null
					}
					const modifiedSkillData = {
						...targetSkill.data,
						...traitSkill.data
					}
					const targetSkillData = targetSkill.data
					return (
						<SkillTooltip
							id={targetSkill._id}
							specialization={specialization}
							currentMoveData={targetSkillData}
							hoverMoveData={modifiedSkillData}
							target={<SkillName name={modifiedSkillData.name} icon={modifiedSkillData.icon} />}
							offset={-10}
						/>
					)
				})()}
			{traitSkill.action &&
				traitSkill.action !== 'ADD' &&
				(() => {
					if (!targetSkill) {
						return null
					}
					const targetSkillData = targetSkill.data
					return (
						<SkillTooltip
							id={targetSkill._id}
							specialization={specialization}
							currentMoveData={targetSkillData}
							hoverMoveData={targetSkillData}
							target={<SkillName name={targetSkillData.name} icon={targetSkillData.icon} />}
							offset={-10}
						/>
					)
				})()}
			{traitSkill.action === 'REPLACE' && <ArrowRight />}
			{traitSkill.action &&
				traitSkill.action !== 'REMOVE' &&
				(() => {
					if (!traitSkill.data) {
						return null
					}
					const newSkillData = traitSkill.data as SkillData
					return (
						<>
							<SkillTooltip
								id={traitSkill.skillId}
								specialization={specialization}
								currentMoveData={newSkillData}
								hoverMoveData={newSkillData}
								target={<SkillName name={newSkillData.name} icon={newSkillData.icon} />}
								offset={-10}
							/>
							{traitSkill.action === 'ADD' && (
								<Typography variant="caption" color="textSecondary" inline>
									{' '}
									<T id="skill.trait.added" />
								</Typography>
							)}
						</>
					)
				})()}
		</TraitTooltipSkillContainer>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		skillData: getData(state)
	}
}

export default connect(mapStateToProps)(React.memo(TraitTooltipSkill))
