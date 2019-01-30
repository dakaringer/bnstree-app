import React from 'react'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'

import { CharacterStats } from '@store/Character'

import { StatListItemContainer } from './style'
import statIcons from './images/statIcons'

interface Props {
	stat: {
		statId: string
		icon: string
		subStats: string[]
	}
	statData: DeepReadonly<CharacterStats>
}

const StatListItem: React.FC<Props> = props => {
	const { stat, statData } = props

	const defaultSubStats =
		stat.statId !== 'int_hp_regen' && !stat.statId.endsWith('_stiff_duration_level') ? (
			<>
				<div key="base">
					<Typography color="textSecondary" inline>
						<T id="character.labels.base" />
					</Typography>
					<Typography color="textSecondary" inline>
						{statData.base_ability[stat.statId]}
					</Typography>
				</div>
				<div key="equip">
					<Typography color="textSecondary" inline>
						<T id="character.labels.equip" />
					</Typography>
					<Typography color="textSecondary" inline>
						{statData.base_ability[stat.statId]}
					</Typography>
				</div>
			</>
		) : null

	return (
		<ExpansionPanel component={StatListItemContainer}>
			<ExpansionPanelSummary expandIcon={<ExpandMore />} classes={{ root: 'summary', content: 'content' }}>
				<div>
					<ImageLoader src={statIcons[stat.icon]} />
					<Typography inline>
						<T id={['character', 'stats', stat.statId]} />
					</Typography>
				</div>
				<Typography color="primary">
					{stat.statId.endsWith('_stiff_duration_level') ? (
						<T id="character.labels.stiff_level" values={{ level: statData.total_ability[stat.statId] }} />
					) : (
						statData.total_ability[stat.statId]
					)}
				</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails className="details">
				{defaultSubStats}
				{stat.subStats.map(subStat => {
					return (
						<div key={subStat}>
							<Typography color="textSecondary" inline>
								<T id={['character', 'stats', subStat]} />
							</Typography>
							<Typography color="textSecondary" inline>
								{stat.statId.endsWith('_stiff_duration_level')
									? statData.total_ability[stat.statId] * 20
									: statData.total_ability[subStat]}
								{subStat.endsWith('rate') ? '%' : ''}
							</Typography>
						</div>
					)
				})}
			</ExpansionPanelDetails>
		</ExpansionPanel>
	)
}

export default StatListItem
