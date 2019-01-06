import * as React from 'react'
import { connect } from 'react-redux'

import { RootState } from '@src/store/rootReducer'
import { getCurrentClass, getFilteredTraits, getSkillPreferences } from '@src/store/Skills/selectors'

import style from './styles/index.css'
import TraitListElement from '@src/components/TraitListElement'

interface PropsFromStore {
	classCode: ReturnType<typeof getCurrentClass>
	traitData: ReturnType<typeof getFilteredTraits>
	skillPreferences: ReturnType<typeof getSkillPreferences>
}

interface Props extends PropsFromStore {}

const TraitList: React.SFC<Props> = props => {
	const { classCode, skillPreferences, traitData } = props

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
								<TraitListElement
									key={trait._id}
									trait={trait}
									specialization={skillPreferences.specialization[classCode]}
								/>
							))}
						</div>
					)
				})}
		</div>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		classCode: getCurrentClass(state),
		traitData: getFilteredTraits(state),
		skillPreferences: getSkillPreferences(state)
	}
}

export default connect(mapStateToProps)(TraitList)
