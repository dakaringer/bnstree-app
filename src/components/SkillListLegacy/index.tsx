import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { groupBy, debounce, get } from 'lodash-es'
import Fuse from 'fuse.js'
import { Typography } from '@material-ui/core'
import T from '@components/T'
import SkillListElement from './components/SkillListElementLegacy'

import { RootState, SkillElement, ClassCode } from '@store'
import { selectors as skillSelectors, actions as skillActions } from '@store/SkillsLegacy'
import { selectors as resourceSelectors } from '@store/Resources'
import { selectors as intlSelectors } from '@store/Intl'

import style from './styles/index.css'
import comparators from './comparators'

interface PropsFromStore {
	skillData: ReturnType<typeof skillSelectors.getData>
	skillPreferences: ReturnType<typeof skillSelectors.getSkillPreferences>
	resource: ReturnType<typeof resourceSelectors.getResource>
	locale: ReturnType<typeof intlSelectors.getLocale>
	messages: ReturnType<typeof intlSelectors.getMessages>
}

interface PropsFromDispatch {
	loadClass: typeof skillActions.loadData
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

		this.state = {
			skillData: undefined,
			filteredSkillData: undefined
		}
	}

	componentDidMount = () => {
		this.processSkills()
	}

	componentDidUpdate = (prevProps: Props) => {
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
			this.debouncedFilterSkills()
		}
	}

	processSkills = () => {
		const { skillData, classCode, element, resource, locale, messages } = this.props
		const tagList = get(messages, 'skill.tag', {})
		const data = (skillData[classCode] || []).map(skill => {
			const moves = skill.moves
				.map(move => {
					const nameData =
						resource.skill[move.name] || resource.skill[`${move.name}-${element.toLocaleLowerCase()}`]

					if (!nameData) {
						console.error(`[BnSTree] Missing skill name data: "${move.name}"`)
						return null
					}

					const tags: string[] = (move.tags || []).map(tag => tagList[tag])

					return {
						...move,
						id: move.name,
						name: nameData.name[locale],
						icon: nameData.icon,
						tags
					}
				})
				.filter(move => move) as typeof skill.moves

			return {
				...skill,
				moves
			}
		})

		this.setState({ skillData: data }, this.debouncedFilterSkills)
	}

	filterSkills = () => {
		const { element, skillPreferences, readonly } = this.props
		const { skillData } = this.state
		if (!skillData) {
			return null
		}

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

		const groupedData = groupBy(data, skill =>
			skillPreferences.order === 'LEVEL' || readonly ? skill.group.minLevel : skill.group.hotkey
		)

		this.setState({ filteredSkillData: groupedData })
	}
	debouncedFilterSkills = debounce(this.filterSkills, 200, { leading: true })

	render = () => {
		const { buildData, classCode, element, skillPreferences, readonly } = this.props
		const { filteredSkillData } = this.state
		const skillData = filteredSkillData

		if (!skillData) {
			return null
		}

		return (
			<div className={style.skillList}>
				{Object.keys(skillData)
					.sort(comparators[skillPreferences.order])
					.map(group => {
						const groupData = skillData[group]
						if (!groupData) {
							return
						}
						return (
							<div key={group}>
								<Typography variant="subtitle1" className={style.groupLabel}>
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
											showHotkey={skillPreferences.order === 'LEVEL' || !!readonly}
											readonly={!!readonly}
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
		skillData: skillSelectors.getData(state),
		skillPreferences: skillSelectors.getSkillPreferences(state),
		resource: resourceSelectors.getResource(state),
		locale: intlSelectors.getLocale(state),
		messages: intlSelectors.getMessages(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			loadClass: skillActions.loadData
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SkillList)
