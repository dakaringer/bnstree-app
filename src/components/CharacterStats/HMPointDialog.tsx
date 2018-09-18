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
import ImageLoader from '@src/components/ImageLoader'

import { DeepReadonly } from '@src/utils/immutableHelper'

import * as style from './styles/HMPointDialog.css'
import statIcons from './images/statIcons'
import { hmPointEffects, hmPointBuffs } from './stats'

interface SelfProps {
	type: 'attack' | 'defense'
	pointData: DeepReadonly<any>
	open: boolean
	close: () => void
}

interface Props extends SelfProps, InjectedProps, Partial<WithWidth> {}

const HMPointDialog: React.SFC<Props> = props => {
	const { type, pointData, open, fullScreen, close } = props

	const hmBonus = hmPointEffects[type]
	const totalPoints = type === 'attack' ? pointData.offense_point : pointData.defense_point

	const additionalBuffs = hmPointBuffs[type].filter(buff => pointData.picks[buff.index].point !== 0).map(buff => {
		return (
			<div className={style.additionalBuff} key={buff.type}>
				<div>
					<ImageLoader key={buff.type} src={statIcons[buff.icon]} />
				</div>
				<div>
					<Typography>
						<T id={['character', 'hm_point_dialog', buff.label]} />
					</Typography>
					<Typography color="textSecondary">
						<T id={['character', 'hm_point_dialog', buff.effect]} />
					</Typography>
				</div>
			</div>
		)
	})

	return (
		<Dialog
			open={open}
			fullScreen={fullScreen}
			onClose={close}
			className={classNames(style.hmPointDialog, style.dialog)}>
			<DialogTitle disableTypography className={style.header}>
				<Typography variant="subheading">
					<T
						id={[
							'character',
							'hm_point_dialog',
							type === 'attack' ? 'hm_attack_points' : 'hm_defense_points'
						]}
					/>
				</Typography>
				<Typography variant="subheading" color="primary" className={style.totalPoints}>
					{totalPoints}P
				</Typography>
				<IconButton color="inherit" onClick={close} className={style.closeButton}>
					<Close />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<div className={style.mainEffectContainer}>
					<div className={style.mainEffect}>
						<Typography className={style.label}>
							<ImageLoader src={statIcons[hmBonus.m1.icon]} />
							<T id={['character', 'stats', hmBonus.m1.statId]} />
						</Typography>
						<Typography color="primary">{pointData[hmBonus.m1.value]}</Typography>
					</div>
					<div className={style.mainEffect}>
						<Typography className={style.label}>
							<ImageLoader src={statIcons[hmBonus.m2.icon]} />
							<T id={['character', 'stats', hmBonus.m2.statId]} />
						</Typography>
						<Typography color="primary">{pointData[hmBonus.m2.value]}</Typography>
					</div>
				</div>
				<Divider />
				<Typography variant="caption">
					<T id="character.hm_point_dialog.additional_effects" />
				</Typography>
				<table className={style.additionalEffects}>
					<tbody>
						{hmBonus.sub.map(additionalEffect => {
							const active = totalPoints >= additionalEffect.req

							return (
								<tr
									key={additionalEffect.req}
									className={classNames(style.additionalEffect, {
										[style.active]: active
									})}>
									<td className={style.additionalEffectReq}>
										<Typography color={active ? 'primary' : 'inherit'}>
											{additionalEffect.req}
										</Typography>
									</td>
									<td>
										{additionalEffect.stat && (
											<Typography color={active ? 'default' : 'inherit'}>
												<T
													id={[
														'character',
														'hm_point_dialog',
														type === 'attack'
															? 'hm_attack_effect_stat'
															: 'hm_defense_effect_stat'
													]}
													values={{
														s1: additionalEffect.stat[0],
														s2: additionalEffect.stat[1]
													}}
												/>
											</Typography>
										)}
										{additionalEffect.effect && (
											<Typography color={active ? 'default' : 'inherit'}>
												<T id={['character', 'hm_point_dialog', additionalEffect.effect]} />
											</Typography>
										)}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
				{additionalBuffs.length > 0 && (
					<>
						<Divider />
						<Typography variant="caption">
							<T id="character.hm_point_dialog.additional_buffs" />
						</Typography>
						{additionalBuffs}
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default withMobileDialog<SelfProps>({ breakpoint: 'xs' })(HMPointDialog)
