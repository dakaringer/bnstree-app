import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Button, IconButton, Input, Hidden, MenuItem, Menu } from '@material-ui/core'
import { Tune, Share, Clear } from '@material-ui/icons'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { get } from 'lodash-es'
import T from '@src/components/T'
import ImageLoader from '@src/components/ImageLoader'
import compose from '@src/utils/compose'

import { RootState } from '@src/store/rootReducer'
import { SkillSpecialization, ClassCode } from '@src/store/constants'
import { getSkillPreferences } from '@src/store/Skills/selectors'
import UserActions from '@src/store/User/actions'

import { classes } from '@src/constants'
import style from './styles/index.css'
import classIcons from '@src/images/classIcons'
import specializationIcons from '@src/images/specializationIcons'
import SettingsDialog from './SettingsDialog'
import specializations from './specializations'

interface PropsFromStore {
	skillPreferences: ReturnType<typeof getSkillPreferences>
}

interface PropsFromDispatch {
	updatePreferences: typeof UserActions.updatePreferences
	updatePreferencesNoSave: typeof UserActions.updatePreferencesNoSave
}

interface SelfProps {
	classCode: ClassCode
	readonly?: boolean
}

interface Props extends SelfProps, InjectedIntlProps, PropsFromStore, PropsFromDispatch {}

interface State {
	settingsDialogOpen: boolean
	classAnchor: HTMLElement | undefined
	specializationAnchor: HTMLElement | undefined
}

class SkillActionBar extends React.PureComponent<Props, State> {
	state: State = {
		settingsDialogOpen: false,
		classAnchor: undefined,
		specializationAnchor: undefined
	}

	selectSpecialization = (specialization: SkillSpecialization<ClassCode>) => {
		const { updatePreferences, classCode } = this.props

		updatePreferences({
			skills: {
				specialization: {
					[classCode]: specialization
				}
			}
		})
		this.setState({ specializationAnchor: undefined })
	}

	search = (value: string) => {
		const { updatePreferencesNoSave } = this.props

		updatePreferencesNoSave({
			skills: {
				search: value
			}
		})
	}

	render = () => {
		const { classCode, intl, skillPreferences } = this.props
		const { settingsDialogOpen, classAnchor, specializationAnchor } = this.state
		const specialization = skillPreferences.specialization[classCode]

		return (
			<div className={style.skillActionBar}>
				<div className={style.leftGroup}>
					<Button
						className={style.className}
						onClick={event => this.setState({ classAnchor: event.currentTarget })}>
						<ImageLoader src={classIcons[classCode]} />
						<Hidden smDown>
							<T id={['general', 'class_names', classCode]} />
						</Hidden>
					</Button>
					<Menu
						anchorEl={classAnchor}
						open={Boolean(classAnchor)}
						onClose={() => this.setState({ classAnchor: undefined })}>
						{classes
							.filter(c => c.classCode !== classCode)
							.map(c => (
								<MenuItem
									key={c.classCode}
									onClick={() => this.setState({ classAnchor: undefined })}
									className={style.menuClassName}
									component={(props: any) => <NavLink to={c.link} {...props} />}>
									<ImageLoader src={classIcons[c.classCode as ClassCode]} />
									<T id={['general', 'class_names', c.classCode]} />
								</MenuItem>
							))}
					</Menu>
					<Button
						className={style.className}
						onClick={event => this.setState({ specializationAnchor: event.currentTarget })}>
						<ImageLoader src={get(specializationIcons, [classCode, specialization], '')} />
						<T id={['general', 'specializations', specialization]} />
					</Button>
					<Menu
						anchorEl={specializationAnchor}
						open={Boolean(specializationAnchor)}
						onClose={() => this.setState({ specializationAnchor: undefined })}>
						{(specializations[classCode] as SkillSpecialization<ClassCode>[])
							.filter(s => s !== specialization)
							.map(s => (
								<MenuItem
									key={s}
									onClick={() => this.selectSpecialization(s)}
									className={style.menuClassName}>
									<ImageLoader src={get(specializationIcons, [classCode, s], '')} />
									<T id={['general', 'specializations', s]} />
								</MenuItem>
							))}
					</Menu>
				</div>
				<div className={style.searchContainer}>
					<Input
						disableUnderline
						placeholder={intl.formatMessage({ id: 'skill.search_placeholder' })}
						className={style.search}
						value={skillPreferences.search}
						onChange={event => this.search(event.currentTarget.value)}
						endAdornment={
							<>
								{skillPreferences.search.trim() !== '' && (
									<IconButton className={style.clear} onClick={() => this.search('')}>
										<Clear />
									</IconButton>
								)}
							</>
						}
					/>
				</div>
				<div className={style.rightGroup}>
					<IconButton
						className={style.button}
						color="inherit"
						onClick={() => this.setState({ settingsDialogOpen: true })}>
						<Tune />
					</IconButton>
					<IconButton className={style.button} color="primary" disabled>
						<Share />
					</IconButton>
				</div>
				<SettingsDialog open={settingsDialogOpen} close={() => this.setState({ settingsDialogOpen: false })} />
			</div>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		skillPreferences: getSkillPreferences(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			updatePreferences: UserActions.updatePreferences,
			updatePreferencesNoSave: UserActions.updatePreferencesNoSave
		},
		dispatch
	)

export default compose<Props, SelfProps>(
	injectIntl,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(SkillActionBar)
