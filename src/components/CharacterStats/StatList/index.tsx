import React, { useState } from 'react'
import { ButtonBase, Typography, Collapse } from '@material-ui/core'
import { ExpandMore, ExpandLess } from '@material-ui/icons'
import { useCallback } from '@utils/hooks'

import T from '@components/T'
import StatListItem from './StatListItem'

import { ClassCode } from '@store'
import { CharacterStats } from '@store/Character'

import { ShowMore } from './style'
import { stats, classElements } from './stats'

interface Props {
	statData: DeepReadonly<CharacterStats>
	type: 'attack' | 'defense'
	classCode: ClassCode
}

const StatList: React.FC<Props> = props => {
	const [showMore, setShowMore] = useState(false)

	const { statData, type, classCode } = props

	const statList = stats[type].filter(stat => {
		const statId = stat.statId
		return !statId.startsWith('attack_attribute') || classElements[classCode].includes(stat.statId)
	})

	return (
		<div>
			{statList.map(stat => (
				<Collapse key={stat.statId} in={stat.essential || showMore}>
					<StatListItem stat={stat} statData={statData} />
				</Collapse>
			))}
			<ButtonBase onClick={useCallback(() => setShowMore(!showMore))} component={ShowMore}>
				<Typography variant="caption" color="textSecondary" inline>
					<T id={showMore ? 'character.navigation.show_less' : 'character.navigation.show_more'} />
				</Typography>
				{showMore ? <ExpandLess /> : <ExpandMore />}
			</ButtonBase>
		</div>
	)
}

export default StatList
