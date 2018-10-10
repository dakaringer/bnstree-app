import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	withMobileDialog,
	Typography,
	IconButton,
	Divider,
	TextField,
	Tooltip,
	InputAdornment
} from '@material-ui/core'
import { Close, HelpOutline } from '@material-ui/icons'
import { InjectedProps } from '@material-ui/core/withMobileDialog'
import { WithWidth } from '@material-ui/core/withWidth'
import classNames from 'classnames'
import ImageLoader from '@src/components/ImageLoader'
import T from '@src/components/T'
import compose from '@src/utils/compose'

import { RootState } from '@src/store/rootReducer'
import { SkillElement } from '@src/store/constants'
import { getSkillPreferences } from '@src/store/Skills/selectors'
import UserActions from '@src/store/User/actions'

import * as style from './styles/SettingsDialog.css'
import elementIcons from './images/elementIcons'

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

interface Props extends SelfProps, PropsFromStore, PropsFromDispatch, InjectedProps, Partial<WithWidth> {}

const SettingsDialog: React.SFC<Props> = props => {
	const { open, fullScreen, close, skillPreferences, updatePreferences } = props

	return (
		<Dialog
			open={open}
			fullScreen={fullScreen}
			onClose={close}
			className={classNames(style.settingsDialog, style.dialog)}>
			<DialogTitle disableTypography className={style.header}>
				<Typography variant="h5" color="primary">
					<T id={'skill.menu.settings'} />
				</Typography>
				<IconButton color="inherit" onClick={close} className={style.closeButton}>
					<Close />
				</IconButton>
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
							updatePreferences({ skills: { stats: { ap: parseInt(event.target.value || '0') } } })
						}
						type="number"
					/>
					<TextField
						id="number"
						label={<T id="skill.menu.additional_damage" />}
						value={skillPreferences.stats.ad}
						onChange={event =>
							updatePreferences({ skills: { stats: { ad: parseInt(event.target.value || '0') } } })
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
							updatePreferences({ skills: { stats: { c: parseInt(event.target.value || '0') } } })
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
							<ImageLoader src={elementIcons[element]} className={style.elementIcon} />
							<TextField
								id="number"
								className={style.elementInput}
								label={<T id={['general', 'element_types', element]} />}
								value={skillPreferences.stats.elementDamage[element as SkillElement] * 100}
								InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
								onChange={event =>
									updatePreferences({
										skills: {
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

export default compose<Props, SelfProps>(
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
	withMobileDialog<SelfProps>({ breakpoint: 'xs' })
)(SettingsDialog)
