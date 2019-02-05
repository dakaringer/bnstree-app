import React, { useState } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Button, IconButton, Input, Hidden, MenuItem, Menu } from '@material-ui/core'
import { Tune, Clear } from '@material-ui/icons'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { get, debounce } from 'lodash-es'
import { classes } from '@utils/constants'
import { useCallback } from '@utils/hooks'
import compose from '@utils/compose'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import ActionBar from '@components/ActionBar'
import SettingsDialog from './SettingsDialog'

import { RootState, SkillSpecialization, ClassCode } from '@store'
import { selectors as skillSelectors } from '@store/Skills'
import { actions as userActions } from '@store/User'

import { MenuItemContainer } from './style'
import specializations from './specializations'
import classIcons from '@src/images/classIcons'
import specializationIcons from '@src/images/specializationIcons'

interface PropsFromStore {
	classCode: ReturnType<typeof skillSelectors.getCurrentClass>
	skillPreferences: ReturnType<typeof skillSelectors.getSkillPreferences>
}

interface PropsFromDispatch {
	updatePreferences: typeof userActions.updatePreferences
	updatePreferencesNoSave: typeof userActions.updatePreferencesNoSave
}

interface Props extends InjectedIntlProps, PropsFromStore, PropsFromDispatch {}

const SkillActionBar: React.FC<Props> = props => {
	const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
	const [classAnchor, setClassAnchor] = useState<HTMLElement | undefined>(undefined)
	const [specializationAnchor, setSpecializationAnchor] = useState<HTMLElement | undefined>(undefined)
	const [searchString, setSearchString] = useState('')

	const filterSkills = useCallback(
		debounce(
			(search: string) => {
				const { updatePreferencesNoSave } = props
				updatePreferencesNoSave({ skills: { search } })
			},
			200,
			{ leading: true }
		)
	)

	const handleSearchInput = useCallback(event => {
		setSearchString(event.target.value || '')
		filterSkills(event.target.value || '')
	})

	const selectSpecialization = useCallback((newSpecialization: SkillSpecialization<ClassCode>) => () => {
		const { updatePreferences, classCode: targetClassCode } = props

		updatePreferences({
			skills: {
				specialization: {
					[targetClassCode]: newSpecialization
				}
			}
		})
		setSpecializationAnchor(undefined)
	})

	const { classCode, intl, skillPreferences } = props
	const specialization = skillPreferences.specialization[classCode]

	return (
		<ActionBar
			left={
				<>
					<Button onClick={useCallback(event => setClassAnchor(event.currentTarget))}>
						<ImageLoader src={classIcons[classCode]} />
						<Hidden smDown>
							<T id={['general', 'class_names', classCode]} />
						</Hidden>
					</Button>
					<Menu
						anchorEl={classAnchor}
						open={!!classAnchor}
						onClose={useCallback(() => setClassAnchor(undefined))}>
						{classes
							.filter(c => c.classCode !== classCode)
							.map(c => (
								<MenuItem
									key={c.classCode}
									onClick={useCallback(() => setClassAnchor(undefined))}
									component={useCallback(({ innerRef, ...linkProps }) => (
										<NavLink to={c.link} {...linkProps} />
									))}>
									<MenuItemContainer>
										<ImageLoader src={classIcons[c.classCode as ClassCode]} />
										<T id={['general', 'class_names', c.classCode]} />
									</MenuItemContainer>
								</MenuItem>
							))}
					</Menu>
					<Button onClick={useCallback(event => setSpecializationAnchor(event.currentTarget))}>
						<ImageLoader src={get(specializationIcons, [classCode, specialization], '')} />
						<T id={['general', 'specializations', specialization]} />
					</Button>
					<Menu
						anchorEl={specializationAnchor}
						open={!!specializationAnchor}
						onClose={useCallback(() => setSpecializationAnchor(undefined))}>
						{(specializations[classCode] as SkillSpecialization<ClassCode>[])
							.filter(s => s !== specialization)
							.map(s => (
								<MenuItem key={s} onClick={selectSpecialization(s)}>
									<MenuItemContainer>
										<ImageLoader src={get(specializationIcons, [classCode, s], '')} />
										<T id={['general', 'specializations', s]} />
									</MenuItemContainer>
								</MenuItem>
							))}
					</Menu>
				</>
			}
			searchInput={
				<Input
					disableUnderline
					placeholder={intl.formatMessage({ id: 'skill.search_placeholder' })}
					value={searchString}
					onChange={handleSearchInput}
					endAdornment={
						<>
							{searchString.trim() !== '' && (
								<IconButton onClick={handleSearchInput}>
									<Clear fontSize="small" />
								</IconButton>
							)}
						</>
					}
				/>
			}
			right={
				<>
					<IconButton color="inherit" onClick={useCallback(() => setSettingsDialogOpen(true))}>
						<Tune fontSize="small" />
					</IconButton>
					<SettingsDialog open={settingsDialogOpen} close={useCallback(() => setSettingsDialogOpen(false))} />
				</>
			}
		/>
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
