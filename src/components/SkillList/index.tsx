import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { intersection, groupBy, debounce, get } from 'lodash-es'
import Fuse from 'fuse.js'
import { Typography } from '@material-ui/core'
import T from '@src/components/T'
import SkillListElement from '@src/components/SkillListElement'

import { SkillElement, ClassCode } from '@src/store/constants'
import { RootState } from '@src/store/rootReducer'
import { getTags } from '@src/store/Intl/selectors'
import { getSkillNames } from '@src/store/Resources/selectors'
import { getData, getSkillPreferences } from '@src/store/Skills/selectors'
import SkillActions from '@src/store/Skills/actions'

import * as style from './styles/index.css'
import comparators from './comparators'

interface PropsFromStore {
	skillData: ReturnType<typeof getData>
	skillPreferences: ReturnType<typeof getSkillPreferences>
	skillNames: ReturnType<typeof getSkillNames>
	tags: ReturnType<typeof getTags>
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
	skillData: { [key: string]: PropsFromStore['skillData'][ClassCode] } | undefined
}

class SkillList extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		const { classCode, loadClass } = props
		loadClass(classCode)

		this.filterSkills = debounce(this.filterSkills, 200, { leading: true })
		this.state = {
			skillData: undefined
		}
	}

	componentDidMount() {
		this.filterSkills()
	}

	componentDidUpdate(prevProps: Props) {
		const { skillData, classCode, skillPreferences, loadClass } = this.props

		if (classCode !== prevProps.classCode) {
			loadClass(classCode)
		}

		if (
			skillData[classCode] !== prevProps.skillData[classCode] ||
			skillPreferences.search !== prevProps.skillPreferences.search ||
			skillPreferences.visibility !== prevProps.skillPreferences.visibility
		) {
			this.filterSkills()
		}
	}

	filterSkills = () => {
		const { skillData, classCode, element, skillPreferences, skillNames, tags, readonly } = this.props
		let data = skillData[classCode]
		if (!data) return null

		let filteredTags: string[] = []
		let filteredSkillNames: string[] = []
		const searchActive = skillPreferences.search.trim() !== ''
		if (searchActive) {
			const fuseOption = {
				threshold: 0.35,
				keys: ['value']
			}
			const fuseTags = new Fuse(tags, fuseOption)
			filteredTags = fuseTags
				.search(skillPreferences.search)
				.map((value: { key: string; value: string }) => value.key)

			const fuseSkillNames = new Fuse(skillNames, fuseOption)
			filteredSkillNames = fuseSkillNames
				.search(skillPreferences.search)
				.map((value: { key: string; value: string }) => value.key)
		}

		data = data.filter(skill => {
			const moves = skill.moves.filter(move => get(move, 'element', element) === element)
			const visibility = (!readonly && skillPreferences.visibility === 'ALL') || moves.length > 1

			let search = true
			if (searchActive) {
				let hasTag = true
				let hasName = true

				const skillTags = skill.moves.reduce((result: string[], move) => result.concat(move.tags || []), [])
				hasTag = intersection(filteredTags, skillTags).length > 0

				const skillNames = skill.moves.reduce((result: string[], move) => result.concat(move.name || []), [])
				hasName = intersection(filteredSkillNames, skillNames).length > 0

				search = hasTag || hasName
			}

			return visibility && search
		})

		const groupedData = groupBy(
			data,
			skill => (skillPreferences.order === 'LEVEL' || readonly ? skill.group.minLevel : skill.group.hotkey)
		)

		this.setState({ skillData: groupedData })
	}

	render() {
		const { buildData, classCode, element, skillPreferences, readonly } = this.props
		const { skillData } = this.state

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
		skillNames: getSkillNames(state),
		tags: getTags(state)
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
