import * as React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography, Divider } from '@material-ui/core'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { CharacterEquipment } from '@src/store/Character/types'

import style from './styles/SoulshieldDialog.css'

interface SelfProps {
	soulshieldData: DeepReadonly<CharacterEquipment['soulshield']>
	open: boolean
	close: () => void
}

interface Props extends SelfProps {}

const SoulshieldDialog: React.SFC<Props> = props => {
	const { soulshieldData, open, close } = props

	const pieceCount: { [key: string]: number } = soulshieldData.pieces.reduce(
		(counter: { [key: string]: number }, piece) => ((counter[piece.name] = ++counter[piece.name] || 1), counter),
		{}
	)

	return (
		<Dialog open={open} onClose={close} className={style.soulshieldDialog}>
			<DialogTitle disableTypography>
				<Typography variant="h5" color="primary">
					<T id="character.navigation.soulshield_attributes" />
				</Typography>
			</DialogTitle>
			<DialogContent>
				<table className={style.soulshieldStats}>
					<thead>
						<tr>
							<td />
							<td />
							<td>
								<Typography variant="caption">
									<T id="character.navigation.soulshield_attributes_breakdown" />
								</Typography>
							</td>
						</tr>
					</thead>
					<tbody>
						{soulshieldData.stats.map(stat => (
							<tr key={stat.stat}>
								<td>
									<Typography variant="caption" noWrap>
										{stat.stat}
									</Typography>
								</td>
								<td className={style.statTotal}>
									<Typography variant="caption" color="primary">
										{stat.total}
									</Typography>
								</td>
								<td className={style.statBreakdown}>
									<Typography variant="caption">{stat.base}</Typography>
									<span className={style.plus}>+</span>
									<Typography variant="caption" color="primary">
										{stat.fuse}
									</Typography>
									<span className={style.plus}>+</span>
									<Typography variant="caption" color="primary">
										{stat.set}
									</Typography>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<Divider />
				{Object.keys(pieceCount).map(set => (
					<div key={set} className={style.set}>
						<Typography variant="caption" className={style.setName}>
							{set}
						</Typography>
						<Typography variant="caption" color="primary">
							[{pieceCount[set]}]
						</Typography>
					</div>
				))}
			</DialogContent>
		</Dialog>
	)
}

export default React.memo(SoulshieldDialog)
