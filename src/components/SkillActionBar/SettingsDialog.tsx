import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	IconButton,
	TextField,
	Tooltip,
	InputAdornment
} from '@material-ui/core'
import { HelpOutline } from '@material-ui/icons'

import T from '@components/T'

import { RootState } from '@store/rootReducer'
import { getCurrentClass, getSkillPreferences } from '@store/Skills/selectors'
import UserActions from '@store/User/actions'

import style from './styles/SettingsDialog.css'

interface PropsFromStore {
	classCode: ReturnType<typeof getCurrentClass>
	skillPreferences: ReturnType<typeof getSkillPreferences>
}

interface PropsFromDispatch {
	updatePreferences: typeof UserActions.updatePreferences
}

interface SelfProps {
	open: boolean
	close: () => void
}

interface Props extends SelfProps, PropsFromStore, PropsFromDispatch {}

const SettingsDialog: React.SFC<Props> = props => {
	const { open, close, classCode, skillPreferences, updatePreferences } = props

	return (
		<Dialog open={open} onClose={close} className={style.settingsDialog}>
			<DialogTitle disableTypography>
				<Typography variant="h5" color="primary">
					<T id={'skill.menu.settings'} />
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Typography variant="subtitle1" className={style.subtitle}>
					<T id="skill.menu.stats" />
				</Typography>
				<div className={style.inputs}>
					<TextField
						label={<T id="skill.menu.attack_power" />}
						value={skillPreferences.stats.ap}
						onChange={event =>
							updatePreferences({ skills: { stats: { ap: parseInt(event.target.value || '0', 10) } } })
						}
						type="number"
					/>
					{(classCode === 'SU' || classCode === 'WL') && (
						<TextField
							label={<T id="skill.menu.attack_power_pet" />}
							value={skillPreferences.stats.apPet}
							onChange={event =>
								updatePreferences({
									skills: { stats: { apPet: parseInt(event.target.value || '0', 10) } }
								})
							}
							type="number"
						/>
					)}
					<TextField
						label={<T id="skill.menu.additional_damage" />}
						value={skillPreferences.stats.ad}
						onChange={event =>
							updatePreferences({ skills: { stats: { ad: parseInt(event.target.value || '0', 10) } } })
						}
						type="number"
					/>
					<TextField
						label={
							<>
								<T id="skill.menu.constant" />
								<Tooltip title={<T id="skill.menu.constant_help" />} placement="bottom-start">
									<IconButton className={style.helpTooltip}>
										<HelpOutline />
									</IconButton>
								</Tooltip>
							</>
						}
						value={skillPreferences.stats.c}
						onChange={event =>
							updatePreferences({ skills: { stats: { c: parseInt(event.target.value || '0', 10) } } })
						}
						type="number"
					/>
					<TextField
						label={<T id="skill.menu.power" />}
						value={isNaN(skillPreferences.stats.power) ? '' : skillPreferences.stats.power}
						InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
						onChange={event =>
							updatePreferences({ skills: { stats: { power: parseFloat(event.target.value) } } })
						}
						onBlur={event => {
							const value = event.target.value
							if (value === '') {
								updatePreferences({ skills: { stats: { power: 100 } } })
							}
						}}
						type="number"
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		classCode: getCurrentClass(state),
		skillPreferences: getSkillPreferences(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			updatePreferences: UserActions.updatePreferences
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(React.memo(SettingsDialog))
