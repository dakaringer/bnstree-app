import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	IconButton,
	Divider,
	TextField,
	Tooltip,
	InputAdornment
} from '@material-ui/core'
import { HelpOutline } from '@material-ui/icons'
import ImageLoader from '@components/ImageLoader'
import T from '@components/T'

import { RootState, SkillElement } from '@store'
import { selectors as skillSelectors } from '@store/SkillsLegacy'
import { actions as userActions } from '@store/User'

import style from './styles/SettingsDialog.css'
import elementIcons from '@src/images/elementIcons'

interface PropsFromStore {
	skillPreferences: ReturnType<typeof skillSelectors.getSkillPreferences>
}

interface PropsFromDispatch {
	updatePreferences: typeof userActions.updatePreferences
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
						id="number"
						label={<T id="skill.menu.attack_power" />}
						value={skillPreferences.stats.ap}
						onChange={event =>
							updatePreferences({ skills: { stats: { ap: parseInt(event.target.value || '0', 10) } } })
						}
						type="number"
					/>
					<TextField
						id="number"
						label={<T id="skill.menu.additional_damage" />}
						value={skillPreferences.stats.ad}
						onChange={event =>
							updatePreferences({ skills: { stats: { ad: parseInt(event.target.value || '0', 10) } } })
						}
						type="number"
					/>
					<TextField
						id="number"
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
				</div>
				<Divider />
				<Typography variant="subtitle1" className={style.subtitle}>
					<T id="skill.menu.element_damage" />
				</Typography>
				<div className={style.inputs}>
					{Object.keys(skillPreferences.stats.elementDamage).map(element => (
						<div key={element}>
							<ImageLoader src={elementIcons[element as SkillElement]} className={style.elementIcon} />
							<TextField
								id="number"
								className={style.elementInput}
								label={<T id={['general', 'element_types', element]} />}
								value={skillPreferences.stats.elementDamage[element as SkillElement] * 100}
								InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
								onChange={event =>
									updatePreferences({
										skillsLegacy: {
											stats: {
												elementDamage: { [element]: parseFloat(event.target.value || '1') }
											}
										}
									})
								}
								type="number"
							/>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		skillPreferences: skillSelectors.getSkillPreferences(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			updatePreferences: userActions.updatePreferences
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(React.memo(SettingsDialog))
