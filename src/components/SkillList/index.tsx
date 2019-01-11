import * as React from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import T from '@src/components/T'

import { RootState } from '@src/store/rootReducer'
import { getFilteredSkills, getSpecialization } from '@src/store/Skills/selectors'

import style from './styles/index.css'
import SkillListElement from '@src/components/SkillListElement'

interface PropsFromStore {
	skillData: ReturnType<typeof getFilteredSkills>
	specialization: ReturnType<typeof getSpecialization>
}

interface Props extends PropsFromStore {}

const SkillList: React.SFC<Props> = props => {
	const { specialization, skillData } = props
	return (
		<div className={style.skillList}>
			{Object.keys(skillData)
				.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
				.map(group => {
					const groupData = skillData[group]
					return (
						<div key={group}>
							<Typography variant="subtitle1" className={style.groupLabel}>
								<T id={['skill', 'group_label', 'level']} values={{ level: group }} />
							</Typography>
							<div className={style.skillGroup}>
								{groupData.map(skill => (
									<SkillListElement key={skill._id} skill={skill} specialization={specialization} />
								))}
							</div>
						</div>
					)
				})}
		</div>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		skillData: getFilteredSkills(state),
		specialization: getSpecialization(state)
	}
}

export default connect(mapStateToProps)(SkillList)
