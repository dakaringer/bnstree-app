import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Button, IconButton, Input, Hidden, MenuItem, Menu } from '@material-ui/core'
import { Tune, Share, Clear } from '@material-ui/icons'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { get, debounce } from 'lodash-es'
import { classes } from '@src/utils/constants'
import compose from '@src/utils/compose'
import specializationIcons from '@src/images/specializationIcons'
import classIcons from '@src/images/classIcons'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'

import { RootState, SkillSpecialization, ClassCode } from '@store'
import { selectors as skillSelectors } from '@store/Skills'
import { actions as userActions } from '@store/User'

import style from './styles/index.css'
import SettingsDialog from './SettingsDialog'
import specializations from './specializations'

interface PropsFromStore {
	classCode: ReturnType<typeof skillSelectors.getCurrentClass>
	skillPreferences: ReturnType<typeof skillSelectors.getSkillPreferences>
}

interface PropsFromDispatch {
	updatePreferences: typeof userActions.updatePreferences
	updatePreferencesNoSave: typeof userActions.updatePreferencesNoSave
}

interface Props extends InjectedIntlProps, PropsFromStore, PropsFromDispatch {}

interface State {
	settingsDialogOpen: boolean
	classAnchor: HTMLElement | undefined
	specializationAnchor: HTMLElement | undefined
	searchString: string
}

class SkillActionBar extends React.PureComponent<Props, State> {
	state: State = {
		settingsDialogOpen: false,
		classAnchor: undefined,
		specializationAnchor: undefined,
		searchString: ''
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

	search = () => {
		const { updatePreferencesNoSave } = this.props
		const { searchString } = this.state

		updatePreferencesNoSave({ skills: { search: searchString } })
	}
	debouncedSearch = debounce(this.search, 200, { leading: true })

	render = () => {
		const { classCode, intl, skillPreferences } = this.props
		const { settingsDialogOpen, classAnchor, specializationAnchor, searchString } = this.state
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
						open={!!classAnchor}
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
						open={!!specializationAnchor}
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
						value={searchString}
						onChange={event => this.setState({ searchString: event.target.value }, this.debouncedSearch)}
						endAdornment={
							<>
								{skillPreferences.search.trim() !== '' && (
									<IconButton
										className={style.clear}
										onClick={() => this.setState({ searchString: '' }, this.debouncedSearch)}>
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
		classCode: skillSelectors.getCurrentClass(state),
		skillPreferences: skillSelectors.getSkillPreferences(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			updatePreferences: userActions.updatePreferences,
			updatePreferencesNoSave: userActions.updatePreferencesNoSave
		},
		dispatch
	)

export default compose<Props, {}>(
	injectIntl,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(SkillActionBar)
