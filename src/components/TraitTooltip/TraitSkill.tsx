import * as React from 'react'
import { connect } from 'react-redux'
import { Typography, ButtonBase } from '@material-ui/core'
import { ArrowRight } from '@material-ui/icons'
import ImageLoader from '@src/components/ImageLoader'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { RootState } from '@src/store/rootReducer'
import { SkillSpecialization, ClassCode } from '@src/store/constants'
import { TraitSkill, SkillData } from '@src/store/Skills/types'
import { getSkillsWithTags, getSkillPreferences } from '@src/store/Skills/selectors'

import { STATIC_SERVER } from '@src/constants'
import style from './styles/TraitSkill.css'
import SkillTooltip from '@src/components/SkillTooltip'

interface PropsFromStore {
	skillData: ReturnType<typeof getSkillsWithTags>
	skillPreferences: ReturnType<typeof getSkillPreferences>
}

interface Props extends PropsFromStore {
	traitSkill: DeepReadonly<TraitSkill>
	specialization: SkillSpecialization<ClassCode>
}

const TraitSkill: React.SFC<Props> = props => {
	const { traitSkill, specialization, skillData } = props

	const classSkills = skillData || []
	const targetSkill = classSkills.find(skill => traitSkill.skillId === skill._id)

	return (
		<div className={style.traitSkill}>
			{!traitSkill.action &&
				(() => {
					if (!targetSkill || !traitSkill.data) return null
					const modifiedSkillData = {
						...targetSkill.data,
						...traitSkill.data
					}
					const targetSkillData = targetSkill.data
					return (
						<>
							<SkillTooltip
								id={targetSkill._id}
								specialization={specialization}
								currentMoveData={targetSkillData}
								hoverMoveData={modifiedSkillData}
								target={
									<ButtonBase className={style.icon}>
										<ImageLoader src={`${STATIC_SERVER}/images/skills/${modifiedSkillData.icon}`} />
									</ButtonBase>
								}
								offset={-10}
							/>
							<Typography color="inherit" className={style.skill}>
								{modifiedSkillData.name}
							</Typography>
						</>
					)
				})()}
			{traitSkill.action &&
				traitSkill.action !== 'ADD' &&
				(() => {
					if (!targetSkill) return null
					const targetSkillData = targetSkill.data
					return (
						<>
							<SkillTooltip
								id={targetSkill._id}
								specialization={specialization}
								currentMoveData={targetSkillData}
								hoverMoveData={targetSkillData}
								target={
									<ButtonBase className={style.icon}>
										<ImageLoader src={`${STATIC_SERVER}/images/skills/${targetSkillData.icon}`} />
									</ButtonBase>
								}
								offset={-10}
							/>
							<Typography color="inherit" className={style.skill}>
								{targetSkillData.name}
							</Typography>
						</>
					)
				})()}
			{traitSkill.action === 'REPLACE' && <ArrowRight className={style.arrow} />}
			{traitSkill.action &&
				traitSkill.action !== 'REMOVE' &&
				(() => {
					if (!traitSkill.data) return null
					const newSkillData = traitSkill.data as SkillData
					return (
						<>
							<SkillTooltip
								id={traitSkill.skillId}
								specialization={specialization}
								currentMoveData={newSkillData}
								hoverMoveData={newSkillData}
								target={
									<ButtonBase className={style.icon}>
										<ImageLoader src={`${STATIC_SERVER}/images/skills/${newSkillData.icon}`} />
									</ButtonBase>
								}
								offset={-10}
							/>
							<Typography color="inherit" className={style.skill}>
								{newSkillData.name}
								{traitSkill.action === 'ADD' && (
									<Typography variant="caption" color="textSecondary" className={style.suffix}>
										<T id="skill.trait.added" />
									</Typography>
								)}
							</Typography>
						</>
					)
				})()}
		</div>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		skillData: getSkillsWithTags(state),
		skillPreferences: getSkillPreferences(state)
	}
}

export default connect(mapStateToProps)(React.memo(TraitSkill))
