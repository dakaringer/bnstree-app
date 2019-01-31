import React from 'react'

import { ActionBarContainer, BarGroup, SearchContainer } from './style'

interface Props {
	left?: React.ReactNode
	right?: React.ReactNode
	searchInput?: React.ReactNode
}

const SkillActionBar: React.FC<Props> = props => {
	const { left, right, searchInput } = props
	return (
		<ActionBarContainer>
			<BarGroup align="left">{left}</BarGroup>
			{searchInput && <SearchContainer>{searchInput}</SearchContainer>}
			<BarGroup align="right">{right}</BarGroup>
		</ActionBarContainer>
	)
}

export default SkillActionBar
