import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { groupBy, debounce, get } from 'lodash-es'
import Fuse from 'fuse.js'
import { Typography } from '@material-ui/core'
import T from '@src/components/T'
import SkillListElement from '@src/components/SkillListElement'

import { SkillElement, ClassCode } from '@src/store/constants'
import { RootState } from '@src/store/rootReducer'
import { getData, getSkillPreferences } from '@src/store/Skills/selectors'
import { getResource } from '@src/store/Resources/selectors'
import { getLocale, getMessages } from '@src/store/Intl/selectors'
import SkillActions from '@src/store/Skills/actions'

import * as style from './styles/index.css'
import comparators from './comparators'

interface PropsFromStore {
	skillData: ReturnType<typeof getData>
	skillPreferences: ReturnType<typeof getSkillPreferences>
	resource: ReturnType<typeof getResource>
	locale: ReturnType<typeof getLocale>
	messages: ReturnType<typeof getMessages>
}

interface PropsFromDispatch {
	loadClass: typeof SkillActions.loadData
}

interface Props extends PropsFromStore, PropsFromDispatch {
	classCode: ClassCode
	element: SkillElement
	buildData: { [id: string]: number } | undefined
	readonly?: boolean
}

interface State {
	skillData: PropsFromStore['skillData'][ClassCode] | undefined
	filteredSkillData: { [key: string]: PropsFromStore['skillData'][ClassCode] } | undefined
}

class SkillList extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		const { classCode, loadClass } = props
		loadClass(classCode)

		this.filterSkills = debounce(this.filterSkills, 200, { leading: true })
		this.state = {
			skillData: undefined,
			filteredSkillData: undefined
		}
	}

	componentDidMount() {
		this.processSkills()
	}

	componentDidUpdate(prevProps: Props) {
		const { skillData, classCode, element, skillPreferences, loadClass } = this.props

		if (classCode !== prevProps.classCode) {
			loadClass(classCode)
		}

		if (skillData[classCode] !== prevProps.skillData[classCode] || element !== prevProps.element) {
			this.processSkills()
		} else if (
			skillPreferences.search !== prevProps.skillPreferences.search ||
			skillPreferences.visibility !== prevProps.skillPreferences.visibility
		) {
			this.filterSkills()
		}
	}

	processSkills = () => {
		const { skillData, classCode, element, resource, locale, messages } = this.props
		const tagList = get(messages, 'skill.tag', {})
		const data = (skillData[classCode] || []).map(skill => {
			const moves = skill.moves.map(move => {
				const nameData =
					resource.skill[move.name] || resource.skill[`${move.name}-${element.toLocaleLowerCase()}`]

				const tags: string[] = (move.tags || []).map(tag => tagList[tag])

				return {
					...move,
					id: move.name,
					name: nameData.name[locale],
					icon: nameData.icon,
					tags
				}
			})

			return {
				...skill,
				moves
			}
		})

		this.setState(
			{
				skillData: data
			},
			this.filterSkills
		)
	}

	filterSkills = () => {
		const { element, skillPreferences, readonly } = this.props
		const { skillData } = this.state
		if (!skillData) return null

		let data = skillData.filter(skill => {
			const moves = skill.moves.filter(move => get(move, 'element', element) === element)
			return (!readonly && skillPreferences.visibility === 'ALL') || moves.length > 1
		})

		if (skillPreferences.search.trim() !== '') {
			const fuseOption = {
				threshold: 0.35,
				keys: ['moves.name', 'moves.tags']
			}
			const fuse = new Fuse(data, fuseOption)
			data = fuse.search(skillPreferences.search)
		}

		const groupedData = groupBy(
			data,
			skill => (skillPreferences.order === 'LEVEL' || readonly ? skill.group.minLevel : skill.group.hotkey)
		)

		this.setState({ filteredSkillData: groupedData })
	}

	render() {
		const { buildData, classCode, element, skillPreferences, readonly } = this.props
		const { filteredSkillData } = this.state
		const skillData = filteredSkillData

		if (!skillData) return null

		return (
			<div className={style.skillList}>
				{Object.keys(skillData)
					.sort(comparators[skillPreferences.order])
					.map(group => {
						const groupData = skillData[group]
						if (!groupData) return
						return (
							<div key={group}>
								<Typography variant="subheading" className={style.groupLabel}>
									{skillPreferences.order === 'LEVEL' || readonly ? (
										<T id={['skill', 'group_label', 'level']} values={{ level: group }} />
									) : (
										<T id={['skill', 'group_label', group]} />
									)}
								</Typography>
								<div className={style.skillGroup}>
									{groupData.map(skill => (
										<SkillListElement
											key={skill._id}
											skillData={skill}
											currentMove={(buildData && buildData[skill._id]) || 1}
											classCode={classCode}
											element={element}
											showHotkey={skillPreferences.order === 'LEVEL' || Boolean(readonly)}
											readonly={Boolean(readonly)}
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
		skillPreferences: getSkillPreferences(state),
		resource: getResource(state),
		locale: getLocale(state),
		messages: getMessages(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			loadClass: SkillActions.loadData
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SkillList)
