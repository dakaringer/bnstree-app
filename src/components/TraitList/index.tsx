import * as React from 'react'
import { connect } from 'react-redux'

import TraitListElement from './components/TraitListElement'

import { RootState } from '@store'
import { selectors as skillSelectors } from '@store/Skills'

import { TraitListcontainer, TraitGroup } from './style'

interface PropsFromStore {
	traitData: ReturnType<typeof skillSelectors.getFilteredTraits>
}

interface Props extends PropsFromStore {}

const TraitList: React.SFC<Props> = props => {
	const { traitData } = props

	return (
		<TraitListcontainer>
			{Object.keys(traitData)
				.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
				.map(group => {
					const groupData = traitData[group]
					if (!groupData) {
						return null
					}
					return (
						<TraitGroup key={group}>
							{groupData.map(trait => (
								<TraitListElement key={trait._id} trait={trait} />
							))}
						</TraitGroup>
					)
				})}
		</TraitListcontainer>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		traitData: skillSelectors.getFilteredTraits(state)
	}
}

export default connect(mapStateToProps)(TraitList)
