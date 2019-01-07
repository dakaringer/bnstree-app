import * as React from 'react'
import { connect } from 'react-redux'

import { RootState } from '@src/store/rootReducer'
import { getFilteredTraits } from '@src/store/Skills/selectors'

import style from './styles/index.css'
import TraitListElement from '@src/components/TraitListElement'

interface PropsFromStore {
	traitData: ReturnType<typeof getFilteredTraits>
}

interface Props extends PropsFromStore {}

const TraitList: React.SFC<Props> = props => {
	const { traitData } = props

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
								<TraitListElement key={trait._id} trait={trait} />
							))}
						</div>
					)
				})}
		</div>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		traitData: getFilteredTraits(state)
	}
}

export default connect(mapStateToProps)(TraitList)
