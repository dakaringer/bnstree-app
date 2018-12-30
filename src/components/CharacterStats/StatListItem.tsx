import * as React from 'react'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import T from '@src/components/T'
import ImageLoader from '@src/components/ImageLoader'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { CharacterStats } from '@src/store/Character/types'

import * as style from './styles/CharacterStatListItem.css'
import statIcons from './images/statIcons'

interface Props {
	stat: {
		statId: string
		icon: string
		subStats: string[]
	}
	statData: DeepReadonly<CharacterStats>
}

const StatListItem: React.SFC<Props> = props => {
	const { stat, statData } = props

	let defaultSubStats =
		stat.statId !== 'int_hp_regen' && !stat.statId.endsWith('_stiff_duration_level') ? (
			<>
				<Typography color="textSecondary" key="base" className={style.subStat}>
					<T id="character.labels.base" />
					{statData.base_ability[stat.statId]}
				</Typography>
				<Typography color="textSecondary" key="equip" className={style.subStat}>
					<T id="character.labels.equip" />
					{statData.equipped_ability[stat.statId]}
				</Typography>
			</>
		) : null

	return (
		<ExpansionPanel className={style.statListItem}>
			<ExpansionPanelSummary
				expandIcon={<ExpandMore />}
				classes={{
					root: style.expandSummary,
					expandIcon: style.expandIcon
				}}>
				<div className={style.statHeader}>
					<Typography className={style.label}>
						<ImageLoader src={statIcons[stat.icon]} />
						<T id={['character', 'stats', stat.statId]} />
					</Typography>
					<Typography color="primary">
						{stat.statId.endsWith('_stiff_duration_level') ? (
							<T
								id="character.labels.stiff_level"
								values={{ level: statData.total_ability[stat.statId] }}
							/>
						) : (
							statData.total_ability[stat.statId]
						)}
					</Typography>
				</div>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails className={style.statDetails}>
				{defaultSubStats}
				{stat.subStats.map(subStat => {
					return (
						<Typography color="textSecondary" key={subStat} className={style.subStat}>
							<T id={['character', 'stats', subStat]} />
							{stat.statId.endsWith('_stiff_duration_level')
								? statData.total_ability[stat.statId] * 20
								: statData.total_ability[subStat]}
							{subStat.endsWith('rate') ? '%' : ''}
						</Typography>
					)
				})}
			</ExpansionPanelDetails>
		</ExpansionPanel>
	)
}

export default React.memo(StatListItem)
