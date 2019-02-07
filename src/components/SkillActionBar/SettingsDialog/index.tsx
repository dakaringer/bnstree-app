import React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Dialog, DialogTitle, DialogContent, Typography, TextField, Tooltip, InputAdornment } from '@material-ui/core'
import { HelpOutline } from '@material-ui/icons'

import T from '@components/T'

import { RootState } from '@store'
import { selectors as skillSelectors } from '@store/Skills'
import { actions as userActions } from '@store/User'

import { InputContainer } from './style'

interface PropsFromStore {
	classCode: ReturnType<typeof skillSelectors.getCurrentClass>
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

const SettingsDialog: React.FC<Props> = props => {
	const { open, close, classCode, skillPreferences, updatePreferences } = props

	const updateValue = (stat: string) => (event: any) => {
		updatePreferences({ skills: { stats: { [stat]: parseInt(event.target.value || '0', 10) } } })
	}

	return (
		<Dialog open={open} onClose={close}>
			<DialogTitle disableTypography>
				<Typography variant="subtitle1" color="primary">
					<T id={'skill.menu.settings'} />
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Typography variant="subtitle1" paragraph>
					<T id="skill.menu.stats" />
				</Typography>
				<InputContainer>
					<TextField
						label={<T id="skill.menu.attack_power" />}
						value={skillPreferences.stats.ap}
						onChange={updateValue('ap')}
						type="number"
					/>
					{(classCode === 'SU' || classCode === 'WL') && (
						<TextField
							label={<T id="skill.menu.attack_power_pet" />}
							value={skillPreferences.stats.apPet}
							onChange={updateValue('apPet')}
							type="number"
						/>
					)}
					<TextField
						label={<T id="skill.menu.additional_damage" />}
						value={skillPreferences.stats.ad}
						onChange={updateValue('ad')}
						type="number"
					/>
					<TextField
						label={
							<>
								<T id="skill.menu.constant" />
								<Tooltip title={<T id="skill.menu.constant_help" />} placement="bottom-start">
									<HelpOutline fontSize="inherit" />
								</Tooltip>
							</>
						}
						value={skillPreferences.stats.c}
						onChange={updateValue('c')}
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
				</InputContainer>
			</DialogContent>
		</Dialog>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		classCode: skillSelectors.getCurrentClass(state),
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
)(SettingsDialog)
