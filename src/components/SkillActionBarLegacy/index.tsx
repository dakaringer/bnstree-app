import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Button, IconButton, Input, Hidden, Checkbox, MenuItem, Menu, Tooltip } from '@material-ui/core'
import { MenuItemProps } from '@material-ui/core/MenuItem'
import { Tune, Share, FilterList, Clear } from '@material-ui/icons'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import compose from '@src/utils/compose'

import { RootState, SkillElement, ClassCode } from '@store'
import { selectors as skillSelectors } from '@store/SkillsLegacy'
import { actions as userActions } from '@store/User'

import { classes } from '@src/utils/constants'
import style from './styles/index.css'
import classIcons from '@src/images/classIcons'
import elementIcons from '@src/images/elementIcons'
import SettingsDialog from './SettingsDialog'

interface PropsFromStore {
	skillPreferences: ReturnType<typeof skillSelectors.getSkillPreferences>
}

interface PropsFromDispatch {
	updatePreferences: typeof userActions.updatePreferences
	updatePreferencesNoSave: typeof userActions.updatePreferencesNoSave
}

interface SelfProps {
	classCode: ClassCode
	element: SkillElement
	readonly?: boolean
}

interface Props extends SelfProps, InjectedIntlProps, PropsFromStore, PropsFromDispatch {}

interface State {
	settingsDialogOpen: boolean
	classAnchor: HTMLElement | undefined
}

class SkillActionBar extends React.PureComponent<Props, State> {
	state: State = {
		settingsDialogOpen: false,
		classAnchor: undefined
	}

	toggleElement = () => {
		const { updatePreferences, classCode, element, skillPreferences } = this.props

		const classElements = Object.keys(skillPreferences.build[classCode])
		const newElement = classElements[0] === element ? classElements[1] : classElements[0]

		updatePreferences({
			skillsLegacy: {
				element: {
					[classCode]: newElement
				}
			}
		})
	}

	search = (value: string) => {
		const { updatePreferencesNoSave } = this.props

		updatePreferencesNoSave({
			skills: {
				search: value
			}
		})
	}

	renderLink = ({ innerRef, ...props }: MenuItemProps, link: string) => <NavLink to={link} {...props} />

	render = () => {
		const { classCode, element, intl, skillPreferences, updatePreferences } = this.props
		const { settingsDialogOpen, classAnchor } = this.state

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
									component={props => this.renderLink(props, c.link)}>
									<ImageLoader src={classIcons[c.classCode as ClassCode]} />
									<T id={['general', 'class_names', c.classCode]} />
								</MenuItem>
							))}
					</Menu>
					<Button className={style.elementToggle} onClick={this.toggleElement}>
						<ImageLoader src={elementIcons[element]} />
						<T id={['general', 'element_types', element]} />
					</Button>
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
								<Tooltip title={<T id="skill.menu.show_trainable" />}>
									<Checkbox
										checked={skillPreferences.visibility === 'TRAINABLE'}
										color="primary"
										className={style.filter}
										icon={<FilterList />}
										checkedIcon={<FilterList />}
										onClick={() =>
											updatePreferences({
												skillsLegacy: {
													visibility:
														skillPreferences.visibility === 'TRAINABLE'
															? 'ALL'
															: 'TRAINABLE'
												}
											})
										}
									/>
								</Tooltip>
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

export default compose<Props, SelfProps>(
	injectIntl,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(SkillActionBar)
