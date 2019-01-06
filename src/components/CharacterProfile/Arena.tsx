import * as React from 'react'
import { Typography } from '@material-ui/core'
import ImageLoader from '@src/components/ImageLoader'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { CharacterProfile as CharacterProfileType } from '@src/store/Character/types'

import style from './styles/Arena.css'
import medals from './images/Medals'

const getRank = (rating: number) => {
	if (rating >= 2100) return 'diamond'
	if (rating >= 1900) return 'platinum'
	if (rating >= 1600) return 'gold'
	if (rating >= 1350) return 'silver'
	return 'bronze'
}

interface Props {
	arenaData: DeepReadonly<CharacterProfileType['arena']>
}

const Arena: React.SFC<Props> = props => {
	const { arenaData } = props

	return (
		<div className={style.arena}>
			<div className={style.stats}>
				<Typography>
					<T id="character.arena.arena" />
				</Typography>
				<Typography variant="caption" color="primary">
					<T
						id="character.arena.stats"
						values={{
							games: arenaData.stats[0],
							wins: arenaData.stats[1],
							winPercentage: arenaData.stats[2]
						}}
					/>
				</Typography>
			</div>
			<div className={style.gameMode}>
				<Typography variant="caption">
					<T id="character.arena.mode_singles" />
				</Typography>
				<Typography className={style.gameModeContainer} variant="caption">
					<ImageLoader src={medals[getRank(arenaData.solo.rating)]} className={style.medal} />
					<span className={style.gameModeStats}>
						{arenaData.solo.rating}
						<T id="character.arena.wins" values={{ games: arenaData.solo.wins }} />
					</span>
				</Typography>
			</div>
			<div className={style.gameMode}>
				<Typography variant="caption">
					<T id="character.arena.mode_tag" />
				</Typography>
				<Typography className={style.gameModeContainer} variant="caption">
					<ImageLoader src={medals[getRank(arenaData.tag.rating)]} className={style.medal} />
					<span className={style.gameModeStats}>
						{arenaData.tag.rating}
						<T id="character.arena.wins" values={{ games: arenaData.tag.wins }} />
					</span>
				</Typography>
			</div>
		</div>
	)
}

export default React.memo(Arena)
