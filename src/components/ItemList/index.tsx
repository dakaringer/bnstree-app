import React, { useEffect } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { classes } from '@utils/constants'

import T from '@components/T'
import comparators from './comparators'
import ItemListElement from './ItemListElement'

import { RootState, ItemType } from '@store'
import { selectors as itemSelectors, actions as itemActions } from '@store/Items'

import { ItemListContainer, ItemListGroup } from './style'

interface PropsFromStore {
	itemData: ReturnType<typeof itemSelectors.getFilteredItems>
}

interface PropsFromDispatch {
	loadItems: typeof itemActions.loadData
}

interface Props extends PropsFromStore, PropsFromDispatch {
	itemType: ItemType
}

const ItemList: React.FC<Props> = props => {
	const { itemData, itemType, loadItems } = props

	useEffect(() => {
		loadItems(itemType)
	}, [itemType])

	return (
		<ItemListContainer>
			{Object.keys(itemData)
				.sort(comparators[itemType])
				.map(group => {
					const groupData = itemData[group]
					if (!groupData) {
						return
					}
					return (
						<ItemListGroup key={group}>
							<Typography variant="subtitle1">
								<T id={['item', 'group_label', itemType, group]} />
							</Typography>
							<div>
								{groupData
									.concat()
									.sort((a, b) => {
										if (!a.classCode) {
											return -1
										}
										if (a.classCode !== b.classCode) {
											return (
												classes.findIndex(c => c.classCode === a.classCode) -
												classes.findIndex(c => c.classCode === b.classCode)
											)
										}
										return a._id > b._id ? 1 : -1
									})
									.map(item => (
										<ItemListElement key={item._id} itemData={item} />
									))}
							</div>
						</ItemListGroup>
					)
				})}
		</ItemListContainer>
	)
}

const mapStateToProps = (state: RootState) => ({
	itemData: itemSelectors.getFilteredItems(state)
})

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			loadItems: itemActions.loadData
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ItemList)
