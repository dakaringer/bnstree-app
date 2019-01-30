import React, { useState } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Button, IconButton, Input, MenuItem, Menu } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { debounce } from 'lodash-es'
import { useCallback } from '@utils/hooks'
import { classes } from '@utils/constants'
import compose from '@utils/compose'
import classIcons from '@src/images/classIcons'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'

import { RootState, ClassCode, ItemFilter } from '@store'
import { selectors as itemSelectors } from '@store/Items'
import { actions as userActions } from '@store/User'

import { ItemActionBarContainer, BarGroup, MenuItemContainer, SearchContainer } from './style'

interface PropsFromStore {
	itemPreferences: ReturnType<typeof itemSelectors.getItemPreferences>
}

interface PropsFromDispatch {
	updatePreferences: typeof userActions.updatePreferences
	updatePreferencesNoSave: typeof userActions.updatePreferencesNoSave
}

interface Props extends InjectedIntlProps, PropsFromStore, PropsFromDispatch {}

const ItemActionBar: React.FC<Props> = props => {
	const [classAnchor, setClassAnchor] = useState<HTMLElement | undefined>(undefined)
	const [searchString, setSearchString] = useState('')

	const { itemPreferences, intl, updatePreferencesNoSave } = props

	const filter = useCallback((value: ItemFilter) => () => {
		const { updatePreferences } = props
		updatePreferences({ items: { filter: value } })
		setClassAnchor(undefined)
	})

	const filterItems = useCallback(
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
		filterItems(event.target.value || '')
	})

	return (
		<ItemActionBarContainer>
			<BarGroup align="left">
				<Button onClick={useCallback(event => setClassAnchor(event.currentTarget))}>
					{itemPreferences.filter !== 'ALL' && <ImageLoader src={classIcons[itemPreferences.filter]} />}
					<T
						id={
							itemPreferences.filter !== 'ALL'
								? ['general', 'class_names', itemPreferences.filter]
								: 'item.general.all'
						}
					/>
				</Button>
				<Menu
					anchorEl={classAnchor}
					open={!!classAnchor}
					onClose={useCallback(() => setClassAnchor(undefined))}>
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
			</BarGroup>
			<SearchContainer>
				<Input
					disableUnderline
					placeholder={intl.formatMessage({ id: 'item.search_placeholder' })}
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
			</SearchContainer>
			<BarGroup align="right" />
		</ItemActionBarContainer>
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
