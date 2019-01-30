import React, { useState } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Button, IconButton, Input, Hidden, Checkbox, MenuItem, Menu, Tooltip } from '@material-ui/core'
import { Tune, Share, FilterList, Clear } from '@material-ui/icons'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { debounce } from 'lodash-es'
import { classes } from '@utils/constants'
import { useCallback } from '@utils/hooks'
import compose from '@utils/compose'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import SettingsDialog from './SettingsDialog'

import { RootState, SkillElement, ClassCode } from '@store'
import { selectors as skillSelectors } from '@store/SkillsLegacy'
import { actions as userActions } from '@store/User'

import classIcons from '@src/images/classIcons'
import elementIcons from '@src/images/elementIcons'

import { SkillActionBarContainer, BarGroup, MenuItemContainer, SearchContainer } from './style'

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

const SkillActionBar: React.FC<Props> = props => {
	const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
	const [classAnchor, setClassAnchor] = useState<HTMLElement | undefined>(undefined)
	const [searchString, setSearchString] = useState('')

	const { classCode, element, intl, skillPreferences, updatePreferences, updatePreferencesNoSave } = props

	const filterSkills = useCallback(
		debounce(
			(search: string) => {
				updatePreferencesNoSave({ skillsLegacy: { search } })
			},
			200,
			{ leading: true }
		)
	)

	const handleSearchInput = useCallback(event => {
		setSearchString(event.target.value || '')
		filterSkills(event.target.value || '')
	})

	const toggleElement = useCallback(() => {
		const classElements = Object.keys(skillPreferences.build[classCode])
		const newElement = classElements[0] === element ? classElements[1] : classElements[0]

		updatePreferences({
			skillsLegacy: {
				element: {
					[classCode]: newElement
				}
			}
		})
	})

	return (
		<SkillActionBarContainer>
			<BarGroup align="left">
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
				<Button onClick={toggleElement}>
					<ImageLoader src={elementIcons[element]} />
					<T id={['general', 'element_types', element]} />
				</Button>
			</BarGroup>
			<SearchContainer>
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
							<Tooltip title={<T id="skill.menu.show_trainable" />}>
								<Checkbox
									checked={skillPreferences.visibility === 'TRAINABLE'}
									color="primary"
									icon={<FilterList fontSize="small" />}
									checkedIcon={<FilterList fontSize="small" />}
									onClick={useCallback(() =>
										updatePreferences({
											skillsLegacy: {
												visibility:
													skillPreferences.visibility === 'TRAINABLE' ? 'ALL' : 'TRAINABLE'
											}
										})
									)}
								/>
							</Tooltip>
						</>
					}
				/>
			</SearchContainer>
			<BarGroup align="right">
				<IconButton color="inherit" onClick={useCallback(() => setSettingsDialogOpen(true))}>
					<Tune fontSize="small" />
				</IconButton>
				<IconButton color="primary" disabled>
					<Share fontSize="small" />
				</IconButton>
			</BarGroup>
			<SettingsDialog open={settingsDialogOpen} close={useCallback(() => setSettingsDialogOpen(false))} />
		</SkillActionBarContainer>
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
