import * as React from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	withMobileDialog,
	Typography,
	IconButton,
	Divider
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { InjectedProps } from '@material-ui/core/withMobileDialog'
import { WithWidth } from '@material-ui/core/withWidth'
import classNames from 'classnames'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { CharacterEquipment } from '@src/store/Character/types'

import * as style from './styles/SoulshieldDialog.css'

interface SelfProps {
	soulshieldData: DeepReadonly<CharacterEquipment['soulshield']>
	open: boolean
	close: () => void
}

interface Props extends SelfProps, InjectedProps, Partial<WithWidth> {}

const SoulshieldDialog: React.SFC<Props> = props => {
	const { soulshieldData, open, fullScreen, close } = props

	const pieceCount: { [key: string]: number } = soulshieldData.pieces.reduce(
		(counter: { [key: string]: number }, piece) => ((counter[piece.name] = ++counter[piece.name] || 1), counter),
		{}
	)

	return (
		<Dialog
			open={open}
			fullScreen={fullScreen}
			onClose={close}
			className={classNames(style.soulshieldDialog, style.dialog)}>
			<DialogTitle disableTypography className={style.header}>
				<Typography variant="h5" color="primary">
					<T id="character.navigation.soulshield_attributes" />
				</Typography>
				<IconButton color="inherit" onClick={close} className={style.closeButton}>
					<Close />
				</IconButton>
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

export default withMobileDialog<SelfProps>({ breakpoint: 'xs' })(SoulshieldDialog)
