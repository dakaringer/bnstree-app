import * as React from 'react'
import { connect } from 'react-redux'
import { groupBy, debounce, get } from 'lodash-es'
import Fuse from 'fuse.js'
import { Typography } from '@material-ui/core'
import T from '@src/components/T'

import { SkillSpecialization, ClassCode } from '@src/store/constants'
import { RootState } from '@src/store/rootReducer'
import { getData, getSkillPreferences } from '@src/store/Skills/selectors'

import style from './styles/index.css'
import SkillListElement from '@src/components/SkillListElement'
import { processSkillNameAndTags } from '@src/utils/helpers'

interface PropsFromStore {
	skillData: ReturnType<typeof getData>
	skillPreferences: ReturnType<typeof getSkillPreferences>
}

interface Props extends PropsFromStore {
	classCode: ClassCode
	specialization: SkillSpecialization<ClassCode>
}

interface State {
	skillData: PropsFromStore['skillData'][ClassCode] | undefined
	filteredSkillData: { [key: string]: PropsFromStore['skillData'][ClassCode] } | undefined
}

class SkillList extends React.PureComponent<Props, State> {
	state: State = {
		skillData: undefined,
		filteredSkillData: undefined
	}

	componentDidMount = () => {
		this.processSkills()
	}

	componentDidUpdate = (prevProps: Props) => {
		const { skillData, classCode, specialization, skillPreferences } = this.props

		if (skillData[classCode] !== prevProps.skillData[classCode] || specialization !== prevProps.specialization) {
			this.processSkills()
		} else if (skillPreferences.search !== prevProps.skillPreferences.search) {
			this.debouncedFilterSkills()
		}
	}

	processSkills = () => {
		const { skillData, classCode, specialization } = this.props
		const data = (skillData[classCode] || [])
			.map(skill => {
				return {
					...skill,
					data: processSkillNameAndTags(skill.data)
				}
			})
			.filter(
				skill => skill && get(skill, 'specialization', specialization) === specialization
			) as typeof skillData[ClassCode]

		this.setState({ skillData: data }, this.debouncedFilterSkills)
	}

	filterSkills = () => {
		const { skillPreferences } = this.props
		const { skillData } = this.state
		if (!skillData) return

		let data = skillData

		if (skillPreferences.search.trim() !== '') {
			const fuseOption = {
				threshold: 0.35,
				keys: ['data.name', 'data.tags']
			}
			const fuse = new Fuse(data, fuseOption)
			data = fuse.search(skillPreferences.search)
		}

		this.setState({ filteredSkillData: groupBy(data, skill => skill.data.minLevel) })
	}
	debouncedFilterSkills = debounce(this.filterSkills, 200, { leading: true })

	render = () => {
		const { specialization } = this.props
		const { filteredSkillData } = this.state
		const skillData = filteredSkillData

		if (!skillData) return null

		return (
			<div className={style.skillList}>
				{Object.keys(skillData)
					.sort((a, b) => parseInt(a) - parseInt(b))
					.map(group => {
						const groupData = skillData[group]
						if (!groupData) return null
						return (
							<div key={group}>
								<Typography variant="subtitle1" className={style.groupLabel}>
									<T id={['skill', 'group_label', 'level']} values={{ level: group }} />
								</Typography>
								<div className={style.skillGroup}>
									{groupData.map(skill => (
										<SkillListElement
											key={skill._id}
											skill={skill}
											specialization={specialization}
										/>
									))}
								</div>
							</div>
						)
					})}
			</div>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		skillData: getData(state),
		skillPreferences: getSkillPreferences(state)
	}
}

export default connect(mapStateToProps)(SkillList)
