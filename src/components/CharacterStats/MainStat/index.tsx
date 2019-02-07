import React, { useState } from 'react'
import { Paper, Typography, ButtonBase } from '@material-ui/core'
import { useCallback } from '@utils/hooks'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'

import { ClassCode } from '@store'
import { CharacterStats } from '@store/Character'

import { hmPointBuffs } from './hmPoint'
import { MainStatContainer, HMPointButton, HMPointBuff } from './style'
import statIcons from './images/statIcons'
import HMPointDialog from './HMPointDialog'

interface Props {
	statData: DeepReadonly<CharacterStats>
	type: 'attack' | 'defense'
	classCode: ClassCode
}

const MainStat: React.FC<Props> = props => {
	const [hmPointDialogOpen, setHmPointDialogOpen] = useState(false)

	const { statData, type } = props

	const mainStat = type === 'attack' ? 'attack_power_value' : 'max_hp'
	const mainStatValue = statData.total_ability[mainStat]

	return (
		<Paper>
			<MainStatContainer type={type}>
				<div>
					<Typography variant="h4" noWrap>
						<T id={['character', 'stats', mainStat]} />
					</Typography>
					<Typography variant="h5" color="primary">
						{mainStatValue}
					</Typography>
				</div>
				<ButtonBase component={HMPointButton} onClick={() => setHmPointDialogOpen(true)}>
					<div>
						<ImageLoader src={statIcons[type === 'attack' ? 'attack_power' : 'defense']} />
						<Typography variant="caption" color="textSecondary" inline>
							{type === 'attack'
								? statData.point_ability.offense_point
								: statData.point_ability.defense_point}
							P
						</Typography>
					</div>
					<div>
						{hmPointBuffs[type].map(buff => {
							return (
								<HMPointBuff
									key={buff.type}
									disabled={statData.point_ability.picks[buff.index].tier === 0}>
									<ImageLoader src={statIcons[buff.icon]} />
									<Typography variant="caption" color="textSecondary" inline>
										{statData.point_ability.picks[buff.index].point}
									</Typography>
								</HMPointBuff>
							)
						})}
					</div>
				</ButtonBase>
			</MainStatContainer>
			<HMPointDialog
				type={type}
				pointData={statData.point_ability}
				open={hmPointDialogOpen}
				close={useCallback(() => setHmPointDialogOpen(false))}
			/>
		</Paper>
	)
}

export default MainStat
