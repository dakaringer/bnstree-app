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
import T from '@src/components/T'

import { RootState } from '@src/store/rootReducer'
import { getSkillPreferences } from '@src/store/Skills/selectors'
import UserActions from '@src/store/User/actions'

import style from './styles/SettingsDialog.css'

interface PropsFromStore {
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
	const { open, close, skillPreferences, updatePreferences } = props

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
							updatePreferences({ skills: { stats: { ap: parseInt(event.target.value || '0') } } })
						}
						type="number"
					/>
					<TextField
						label={<T id="skill.menu.additional_damage" />}
						value={skillPreferences.stats.ad}
						onChange={event =>
							updatePreferences({ skills: { stats: { ad: parseInt(event.target.value || '0') } } })
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
							updatePreferences({ skills: { stats: { c: parseInt(event.target.value || '0') } } })
						}
						type="number"
					/>
					<TextField
						label={<T id="skill.menu.power" />}
						value={skillPreferences.stats.power * 100}
						InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
						onChange={event =>
							updatePreferences({ skills: { stats: { power: parseFloat(event.target.value || '1') } } })
						}
						type="number"
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
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
