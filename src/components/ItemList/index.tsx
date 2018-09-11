import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { groupBy, debounce } from 'lodash-es'
import Fuse from 'fuse.js'
import { Typography } from '@material-ui/core'
import T from '@src/components/T'
import ItemListElement from '@src/components/ItemListElement'

import { ItemType } from '@src/store/constants'
import { RootState } from '@src/store/rootReducer'
import { getData, getItemPreferences } from '@src/store/Items/selectors'
import { getResource } from '@src/store/Resources/selectors'
import { getLocale } from '@src/store/Intl/selectors'
import ItemActions from '@src/store/Items/actions'

import * as style from './styles/index.css'
import comparators from './comparators'
import { classes } from '@src/components/Navigation/links'

interface PropsFromStore {
	itemData: ReturnType<typeof getData>
	itemPreferences: ReturnType<typeof getItemPreferences>
	resource: ReturnType<typeof getResource>
	locale: ReturnType<typeof getLocale>
}

interface PropsFromDispatch {
	loadItems: typeof ItemActions.loadData
}

interface Props extends PropsFromStore, PropsFromDispatch {
	itemType: ItemType
}

interface State {
	itemData: PropsFromStore['itemData'][ItemType] | undefined
	filteredItemData: { [key: string]: PropsFromStore['itemData'][ItemType] } | undefined
}

class ItemList extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		const { itemType, loadItems } = props
		loadItems(itemType)

		this.filterItems = debounce(this.filterItems, 200, { leading: true })
		this.state = {
			itemData: undefined,
			filteredItemData: undefined
		}
	}

	componentDidUpdate(prevProps: Props) {
		const { itemData, itemType, itemPreferences, loadItems } = this.props

		if (itemType !== prevProps.itemType) {
			loadItems(itemType)
		}

		if (itemData[itemType] !== prevProps.itemData[itemType]) {
			this.processItems()
		} else if (itemPreferences !== prevProps.itemPreferences) {
			this.filterItems()
		}
	}

	processItems = () => {
		const { itemData, itemType, resource, locale } = this.props

		const data = (itemData[itemType] || []).map(item => {
			const nameData = resource.item[item.name]

			return {
				...item,
				id: item.name,
				name: nameData.name[locale],
				icon: nameData.icon
			}
		})

		this.setState(
			{
				itemData: data
			},
			this.filterItems
		)
	}

	filterItems = () => {
		const { itemPreferences } = this.props
		const { itemData } = this.state
		if (!itemData) return null

		let data = itemData.filter(item => {
			return itemPreferences.filter === 'ALL' || !item.classCode || item.classCode === itemPreferences.filter
		})

		if (itemPreferences.search.trim() !== '') {
			const fuseOption = {
				threshold: 0.35,
				keys: ['name']
			}
			const fuse = new Fuse(data, fuseOption)
			data = fuse.search(itemPreferences.search)
		}

		const groupedData = groupBy(data, item => item.group)

		this.setState({ filteredItemData: groupedData })
	}

	render() {
		const { itemType } = this.props
		const { filteredItemData } = this.state
		const itemData = filteredItemData

		if (!itemData) return null

		return (
			<div className={style.skillList}>
				{Object.keys(itemData)
					.sort(comparators[itemType])
					.map(group => {
						const groupData = itemData[group]
						if (!groupData) return
						return (
							<div key={group}>
								<Typography variant="subheading" className={style.groupLabel}>
									<T id={['item', 'group_label', itemType, group]} />
								</Typography>
								<div className={style.itemGroup}>
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
							</div>
						)
					})}
			</div>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		itemData: getData(state),
		itemPreferences: getItemPreferences(state),
		resource: getResource(state),
		locale: getLocale(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			loadItems: ItemActions.loadData
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ItemList)
