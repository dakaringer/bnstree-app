import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography, Divider } from '@material-ui/core'

import T from '@components/T'

import { CharacterEquipment } from '@store/Character'

import { SoulshieldStatDistributionTable } from './style'

interface Props {
	soulshieldData: DeepReadonly<CharacterEquipment['soulshield']>
	open: boolean
	close: () => void
}

const SoulshieldDialog: React.FC<Props> = props => {
	const { soulshieldData, open, close } = props

	const pieceCount: { [key: string]: number } = soulshieldData.pieces
		.filter(piece => piece.name)
		.reduce(
			(counter: { [key: string]: number }, piece) => (
				(counter[piece.name] = ++counter[piece.name] || 1), counter
			),
			{}
		)

	return (
		<Dialog open={open} onClose={close} maxWidth="xs">
			<DialogTitle disableTypography>
				<Typography variant="subtitle1" color="primary">
					<T id="character.navigation.soulshield_attributes" />
				</Typography>
			</DialogTitle>
			<DialogContent>
				<SoulshieldStatDistributionTable>
					<thead>
						<tr>
							<td />
							<td />
							<td>
								<Typography variant="caption" color="textSecondary">
									<T id="character.navigation.soulshield_attributes_breakdown" />
								</Typography>
							</td>
						</tr>
					</thead>
					<tbody>
						{soulshieldData.stats.map(stat => (
							<tr key={stat.stat}>
								<td>
									<Typography inline variant="caption" noWrap>
										{stat.stat}
									</Typography>
								</td>
								<td>
									<Typography inline variant="caption" color="primary" align="right">
										{stat.total}
									</Typography>
								</td>
								<td>
									<Typography inline variant="caption">
										{stat.base} +{' '}
									</Typography>
									<Typography inline variant="caption" color="primary">
										{stat.fuse}{' '}
									</Typography>
									<Typography inline variant="caption">
										+{' '}
									</Typography>
									<Typography inline variant="caption" color="primary">
										{stat.set}
									</Typography>
								</td>
							</tr>
						))}
					</tbody>
				</SoulshieldStatDistributionTable>
				<Divider />
				{Object.keys(pieceCount).map(set => (
					<div key={set}>
						<Typography variant="caption" inline>
							{set}{' '}
						</Typography>
						<Typography variant="caption" inline color="primary">
							[{pieceCount[set]}]
						</Typography>
					</div>
				))}
			</DialogContent>
		</Dialog>
	)
}

export default SoulshieldDialog
