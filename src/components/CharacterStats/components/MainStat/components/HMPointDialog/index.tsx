import * as React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography, Divider } from '@material-ui/core'
import classNames from 'classnames'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'

import { CharacterStats } from '@store/Character'

import style from './styles/HMPointDialog.css'
import statIcons from './images/statIcons'
import { hmPointEffects, hmPointBuffs } from './hmPoint'

interface Props {
	type: 'attack' | 'defense'
	pointData: DeepReadonly<CharacterStats['point_ability']>
	open: boolean
	close: () => void
}

const getAdditionalBuffValues = (type: string, tier: number) => {
	switch (type) {
		case 'threat':
			return {
				value1: tier * 100,
				value2: null
			}
		case 'energy':
			return {
				value1: tier * 500,
				value2: tier * 50
			}
		case 'regen':
			return {
				value1: tier * 1000,
				value2: tier * 2
			}
		case 'speed':
			return {
				value1: tier * 5,
				value2: tier * 5
			}
		case 'status':
			return {
				value1: tier * 120,
				value2: tier * 200
			}
	}
}

const HMPointDialog: React.SFC<Props> = props => {
	const { type, pointData, open, close } = props

	const hmBonus = hmPointEffects[type]
	const totalPoints = type === 'attack' ? pointData.offense_point : pointData.defense_point

	const additionalBuffs = hmPointBuffs[type]
		.filter(buff => pointData.picks[buff.index].tier !== 0)
		.map(buff => {
			return (
				<div className={style.additionalBuff} key={buff.type}>
					<div>
						<ImageLoader key={buff.type} src={statIcons[buff.icon]} />
					</div>
					<div>
						<Typography>
							<T id={['character', 'hm_point_dialog', buff.label]} /> {pointData.picks[buff.index].point}
						</Typography>
						<Typography color="textSecondary">
							<T
								id={['character', 'hm_point_dialog', buff.effect]}
								values={getAdditionalBuffValues(buff.type, pointData.picks[buff.index].tier)}
							/>
						</Typography>
					</div>
				</div>
			)
		})

	return (
		<Dialog open={open} onClose={close} className={style.hmPointDialog}>
			<DialogTitle disableTypography>
				<Typography variant="subtitle1">
					<T
						id={[
							'character',
							'hm_point_dialog',
							type === 'attack' ? 'hm_attack_points' : 'hm_defense_points'
						]}
					/>
				</Typography>
				<Typography variant="subtitle1" color="primary" className={style.totalPoints}>
					{totalPoints}P
				</Typography>
			</DialogTitle>
			<DialogContent>
				<div className={style.mainEffectContainer}>
					<div className={style.mainEffect}>
						<Typography className={style.label}>
							<ImageLoader src={statIcons[hmBonus.m1.icon]} />
							<T id={['character', 'stats', hmBonus.m1.statId]} />
						</Typography>
						<Typography color="primary">
							{pointData[hmBonus.m1.value as 'attack_power_value' | 'attack_attribute_value']}
						</Typography>
					</div>
					<div className={style.mainEffect}>
						<Typography className={style.label}>
							<ImageLoader src={statIcons[hmBonus.m2.icon]} />
							<T id={['character', 'stats', hmBonus.m2.statId]} />
						</Typography>
						<Typography color="primary">
							{pointData[hmBonus.m2.value as 'max_hp' | 'defend_power_value']}
						</Typography>
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

export default React.memo(HMPointDialog)
