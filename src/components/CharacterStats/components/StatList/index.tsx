import * as React from 'react'
import { ButtonBase, Typography, Collapse } from '@material-ui/core'
import { ExpandMore, ExpandLess } from '@material-ui/icons'

import T from '@components/T'

import { ClassCode } from '@store'
import { CharacterStats } from '@store/Character'

import style from './styles/StatList.css'
import { stats, classElements } from './stats'
import StatListItem from './components/StatListItem'

interface Props {
	statData: DeepReadonly<CharacterStats>
	type: 'attack' | 'defense'
	classCode: ClassCode
}

interface State {
	showMore: boolean
}

class StatList extends React.PureComponent<Props, State> {
	state: State = {
		showMore: false
	}

	render = () => {
		const { statData, type, classCode } = this.props
		const { showMore } = this.state

		const statList = stats[type].filter(stat => {
			const statId = stat.statId
			return !statId.startsWith('attack_attribute') || classElements[classCode].includes(stat.statId)
		})

		return (
			<div className={style.statList}>
				{statList.map(stat => (
					<Collapse key={stat.statId} in={stat.essential || showMore}>
						<StatListItem stat={stat} statData={statData} />
					</Collapse>
				))}
				<ButtonBase onClick={() => this.setState({ showMore: !showMore })} className={style.expandButton}>
					<Typography variant="caption" color="textSecondary">
						{showMore ? (
							<>
								<T id="character.navigation.show_less" />
								<ExpandLess />
							</>
						) : (
							<>
								<T id="character.navigation.show_more" />
								<ExpandMore />
							</>
						)}
					</Typography>
				</ButtonBase>
			</div>
		)
	}
}

export default StatList
