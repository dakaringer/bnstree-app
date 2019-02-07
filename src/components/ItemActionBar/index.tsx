import React, { useState, useEffect } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Button, IconButton, Input, MenuItem, Menu } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { classes } from '@utils/constants'
import { useDebounce } from '@utils/hooks'
import compose from '@utils/compose'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import ActionBar from '@components/ActionBar'

import { RootState, ClassCode, ItemFilter } from '@store'
import { selectors as itemSelectors } from '@store/Items'
import { actions as userActions } from '@store/User'

import { MenuItemContainer } from './style'
import classIcons from '@src/images/classIcons'

interface PropsFromStore {
	itemPreferences: ReturnType<typeof itemSelectors.getItemPreferences>
}

interface PropsFromDispatch {
	updatePreferences: typeof userActions.updatePreferences
	updatePreferencesNoSave: typeof userActions.updatePreferencesNoSave
}

interface Props extends InjectedIntlProps, PropsFromStore, PropsFromDispatch {}

const ItemActionBar: React.FC<Props> = props => {
	const { itemPreferences, intl, updatePreferencesNoSave } = props
	const [classAnchor, setClassAnchor] = useState<HTMLElement | undefined>(undefined)
	const [searchString, setSearchString] = useState('')
	const debouncedSearchString = useDebounce(searchString, 200)

	useEffect(() => {
		updatePreferencesNoSave({ items: { search: debouncedSearchString } })
	}, [debouncedSearchString])

	const filter = (value: ItemFilter) => () => {
		const { updatePreferences } = props
		updatePreferences({ items: { filter: value } })
		setClassAnchor(undefined)
	}

	return (
		<ActionBar
			left={
				<>
					<Button onClick={event => setClassAnchor(event.currentTarget)}>
						{itemPreferences.filter !== 'ALL' && <ImageLoader src={classIcons[itemPreferences.filter]} />}
						<T
							id={
								itemPreferences.filter !== 'ALL'
									? ['general', 'class_names', itemPreferences.filter]
									: 'item.general.all'
							}
						/>
					</Button>
					<Menu anchorEl={classAnchor} open={!!classAnchor} onClose={() => setClassAnchor(undefined)}>
						{itemPreferences.filter !== 'ALL' && (
							<MenuItem key="all" onClick={filter('ALL')}>
								<T id="item.general.all" />
							</MenuItem>
						)}
						{classes
							.filter(c => c.classCode !== itemPreferences.filter)
							.map(c => (
								<MenuItem key={c.classCode} onClick={filter(c.classCode as ClassCode)}>
									<MenuItemContainer>
										<ImageLoader src={classIcons[c.classCode as ClassCode]} />
										<T id={['general', 'class_names', c.classCode]} />
									</MenuItemContainer>
								</MenuItem>
							))}
					</Menu>
				</>
			}
			searchInput={
				<Input
					disableUnderline
					placeholder={intl.formatMessage({ id: 'item.search_placeholder' })}
					value={searchString}
					onChange={event => setSearchString(event.target.value)}
					endAdornment={
						<>
							{searchString.trim() !== '' && (
								<IconButton onClick={() => setSearchString('')}>
									<Clear fontSize="small" />
								</IconButton>
							)}
						</>
					}
				/>
			}
		/>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		itemPreferences: itemSelectors.getItemPreferences(state)
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
)(ItemActionBar)
