import * as React from 'react'
import { Typography } from '@material-ui/core'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'

import { CharacterProfile as CharacterProfileType } from '@store/Character/types'

import { ArenaContainer, GameMode } from './style'
import medals from './images/Medals'

const getRank = (rating: number) => {
	if (rating >= 2100) {
		return 'diamond'
	}
	if (rating >= 1900) {
		return 'platinum'
	}
	if (rating >= 1600) {
		return 'gold'
	}
	if (rating >= 1350) {
		return 'silver'
	}
	return 'bronze'
}

interface Props {
	arenaData: DeepReadonly<CharacterProfileType['arena']>
}

const Arena: React.SFC<Props> = props => {
	const { arenaData } = props

	return (
		<ArenaContainer>
			<div className="stats">
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
			<div>
				<Typography variant="caption">
					<T id="character.arena.mode_singles" />
				</Typography>
				<GameMode>
					<ImageLoader src={medals[getRank(arenaData.solo.rating)]} />
					<Typography variant="caption">
						<div>{arenaData.solo.rating}</div>
						<div>
							<T id="character.arena.wins" values={{ games: arenaData.solo.wins }} />
						</div>
					</Typography>
				</GameMode>
			</div>
			<div>
				<Typography variant="caption">
					<T id="character.arena.mode_tag" />
				</Typography>
				<GameMode>
					<ImageLoader src={medals[getRank(arenaData.tag.rating)]} />
					<Typography variant="caption">
						<div>{arenaData.tag.rating}</div>
						<div>
							<T id="character.arena.wins" values={{ games: arenaData.tag.wins }} />
						</div>
					</Typography>
				</GameMode>
			</div>
		</ArenaContainer>
	)
}

export default React.memo(Arena)
