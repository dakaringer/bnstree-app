import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { groupBy, debounce, intersection } from 'lodash-es'
import Fuse from 'fuse.js'
import { Typography } from '@material-ui/core'
import T from '@src/components/T'
import ItemListElement from '@src/components/ItemListElement'

import { ItemType } from '@src/store/constants'
import { RootState } from '@src/store/rootReducer'
import { getData, getItemPreferences } from '@src/store/Items/selectors'
import { getItemNames } from '@src/store/Resources/selectors'
import ItemActions from '@src/store/Items/actions'

import * as style from './styles/index.css'
import comparators from './comparators'

interface PropsFromStore {
	itemData: ReturnType<typeof getData>
	itemNames: ReturnType<typeof getItemNames>
	itemPreferences: ReturnType<typeof getItemPreferences>
}

interface PropsFromDispatch {
	loadItems: typeof ItemActions.loadData
}

interface Props extends PropsFromStore, PropsFromDispatch {
	itemType: ItemType
}

interface State {
	itemData: { [key: string]: PropsFromStore['itemData'][ItemType] } | undefined
}

class ItemList extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		const { itemType, loadItems } = props
		loadItems(itemType)

		this.filterItems = debounce(this.filterItems, 200, { leading: true })
		this.state = {
			itemData: undefined
		}
	}

	componentDidMount() {
		this.filterItems()
	}

	componentDidUpdate(prevProps: Props) {
		const { itemData, itemType, itemPreferences, loadItems } = this.props

		if (itemType !== prevProps.itemType) {
			loadItems(itemType)
		}

		if (itemData[itemType] !== prevProps.itemData[itemType] || itemPreferences !== prevProps.itemPreferences) {
			this.filterItems()
		}
	}

	filterItems = () => {
		const { itemData, itemType, itemNames, itemPreferences } = this.props
		let data = itemData[itemType]
		if (!data) return null

		let filteredItems: string[] = []
		const searchActive = itemPreferences.search.trim() !== ''
		if (searchActive) {
			const fuseOption = {
				threshold: 0.35,
				keys: ['value']
			}
			const fuseTags = new Fuse(itemNames, fuseOption)
			filteredItems = fuseTags
				.search(itemPreferences.search)
				.map((value: { key: string; value: string }) => value.key)
		}

		data = data.filter(item => {
			const visibility =
				itemPreferences.filter === 'ALL' || !item.classCode || item.classCode === itemPreferences.filter

			let search = true
			if (searchActive) {
				let hasName = true
				let hasFuse = true
				hasName = filteredItems.includes(item.name)
				hasFuse = intersection(filteredItems, item.fuse || []).length > 0

				search = hasName || hasFuse
			}

			return visibility && search
		})

		const groupedData = groupBy(data, item => item.group)

		this.setState({ itemData: groupedData })
	}

	render() {
		const { itemType } = this.props
		const { itemData } = this.state

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
									{groupData.map(item => (
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
		itemNames: getItemNames(state),
		itemPreferences: getItemPreferences(state)
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
