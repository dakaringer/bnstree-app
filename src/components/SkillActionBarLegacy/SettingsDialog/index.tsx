import React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
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

import { InputContainer } from './style'
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

const SettingsDialog: React.FC<Props> = props => {
	const { open, close, skillPreferences, updatePreferences } = props

	const updateValue = (stat: string) => (event: any) => {
		updatePreferences({ skills: { stats: { [stat]: parseInt(event.target.value || '0', 10) } } })
	}
	const updateElementValue = (element: string) => (event: any) => {
		updatePreferences({
			skillsLegacy: { stats: { elementDamage: { [element]: parseInt(event.target.value || '1', 10) } } }
		})
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
				</InputContainer>
				<Divider />
				<Typography variant="subtitle1" paragraph>
					<T id="skill.menu.element_damage" />
				</Typography>
				<InputContainer>
					{Object.keys(skillPreferences.stats.elementDamage).map(element => (
						<div key={element}>
							<ImageLoader src={elementIcons[element as SkillElement]} />
							<TextField
								id="number"
								className="element-input"
								label={<T id={['general', 'element_types', element]} />}
								value={skillPreferences.stats.elementDamage[element as SkillElement] * 100}
								InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
								onChange={updateElementValue(element)}
								type="number"
							/>
						</div>
					))}
				</InputContainer>
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
)(SettingsDialog)
