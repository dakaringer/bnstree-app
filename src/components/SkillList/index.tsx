import React from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'

import T from '@components/T'
import SkillListElement from './SkillListElement'

import { RootState } from '@store'
import { selectors as skillSelectors } from '@store/Skills'

import { SkillListContainer, SkillListGroup } from './style'

interface PropsFromStore {
	skillData: ReturnType<typeof skillSelectors.getFilteredSkills>
	specialization: ReturnType<typeof skillSelectors.getSpecialization>
}

interface Props extends PropsFromStore {}

const SkillList: React.FC<Props> = props => {
	const { specialization, skillData } = props
	return (
		<SkillListContainer>
			{Object.keys(skillData)
				.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
				.map(group => {
					const groupData = skillData[group]
					return (
						<SkillListGroup key={group}>
							<Typography variant="subtitle1">
								<T id={['skill', 'general', 'level']} values={{ level: group }} />
							</Typography>
							<div>
								{groupData.map(skill => (
									<SkillListElement key={skill._id} skill={skill} specialization={specialization} />
								))}
							</div>
						</SkillListGroup>
					)
				})}
		</SkillListContainer>
	)
}

const mapStateToProps = (state: RootState) => ({
	skillData: skillSelectors.getFilteredSkills(state),
	specialization: skillSelectors.getSpecialization(state)
})

export default connect(mapStateToProps)(SkillList)
