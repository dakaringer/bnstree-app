import * as React from 'react'
import { connect } from 'react-redux'
import { groupBy, debounce } from 'lodash-es'
import Fuse from 'fuse.js'

import { SkillSpecialization, ClassCode } from '@src/store/constants'
import { RootState } from '@src/store/rootReducer'
import { getTraits, getSkillPreferences } from '@src/store/Skills/selectors'

import { getNameData } from '@src/utils/helpers'
import * as style from './styles/index.css'
import TraitListElement from '@src/components/TraitListElement'

interface PropsFromStore {
	traitData: ReturnType<typeof getTraits>
	skillPreferences: ReturnType<typeof getSkillPreferences>
}

interface Props extends PropsFromStore {
	classCode: ClassCode
	specialization: SkillSpecialization<ClassCode>
	buildData: number[] | undefined
}

interface State {
	traitData: PropsFromStore['traitData'][ClassCode] | undefined
	filteredTraitData: { [key: string]: PropsFromStore['traitData'][ClassCode] } | undefined
}

class TraitList extends React.PureComponent<Props, State> {
	state: State = {
		traitData: undefined,
		filteredTraitData: undefined
	}

	componentDidMount = () => {
		this.processTraits()
	}

	componentDidUpdate = (prevProps: Props) => {
		const { traitData, classCode, specialization, skillPreferences } = this.props

		if (traitData[classCode] !== prevProps.traitData[classCode] || specialization !== prevProps.specialization) {
			this.processTraits()
		} else if (skillPreferences.search !== prevProps.skillPreferences.search) {
			this.debouncedFilterTraits()
		}
	}

	processTraits = () => {
		const { traitData, classCode, specialization } = this.props
		const data = (traitData[classCode] || [])
			.map(trait => {
				const nameData = getNameData(trait.data.name, 'trait')

				if (!nameData) return null

				return {
					...trait,
					specialization: trait.specialization || specialization,
					data: {
						...trait.data,
						name: nameData.name,
						icon: nameData.icon
					}
				}
			})
			.filter(trait => trait && trait.specialization === specialization) as typeof traitData[ClassCode]

		this.setState({ traitData: data }, this.debouncedFilterTraits)
	}

	filterTraits = () => {
		const { skillPreferences } = this.props
		const { traitData } = this.state
		if (!traitData) return

		let data = traitData

		if (skillPreferences.search.trim() !== '') {
			const fuseOption = {
				threshold: 0.35,
				keys: ['data.name', 'data.tags']
			}
			const fuse = new Fuse(data, fuseOption)
			data = fuse.search(skillPreferences.search)
		}

		this.setState({ filteredTraitData: groupBy(data, trait => trait.index[0]) })
	}
	debouncedFilterTraits = debounce(this.filterTraits)

	render = () => {
		const { specialization } = this.props
		const { filteredTraitData } = this.state
		const traitData = filteredTraitData

		if (!traitData) return null

		return (
			<div className={style.traitList}>
				{Object.keys(traitData)
					.sort((a, b) => parseInt(a) - parseInt(b))
					.map(group => {
						const groupData = traitData[group]
						if (!groupData) return null
						return (
							<div key={group} className={style.traitGroup}>
								{groupData.map(trait => (
									<TraitListElement key={trait._id} trait={trait} specialization={specialization} />
								))}
							</div>
						)
					})}
			</div>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		traitData: getTraits(state),
		skillPreferences: getSkillPreferences(state)
	}
}

export default connect(mapStateToProps)(TraitList)
