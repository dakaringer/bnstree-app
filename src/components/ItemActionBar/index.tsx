import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Button, IconButton, Input, MenuItem, Menu } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import T from '@src/components/T'
import ImageLoader from '@src/components/ImageLoader'
import compose from '@src/utils/compose'
import { classes } from '@src/components/Navigation/links'

import { RootState } from '@src/store/rootReducer'
import { ClassCode, ItemFilter } from '@src/store/constants'
import { getItemPreferences } from '@src/store/Items/selectors'
import UserActions from '@src/store/User/actions'

import * as style from './styles/index.css'
import classIcons from '@src/images/classIcons'

interface PropsFromStore {
	itemPreferences: ReturnType<typeof getItemPreferences>
}

interface PropsFromDispatch {
	updatePreferences: typeof UserActions.updatePreferences
	updatePreferencesNoSave: typeof UserActions.updatePreferencesNoSave
}

interface SelfProps {}

interface Props extends SelfProps, InjectedIntlProps, PropsFromStore, PropsFromDispatch {}

interface State {
	classAnchor: HTMLElement | undefined
}

class ItemActionBar extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			classAnchor: undefined
		}
	}

	search = (value: string) => {
		const { updatePreferencesNoSave } = this.props

		updatePreferencesNoSave({
			items: {
				search: value
			}
		})
	}

	filter = (value: ItemFilter) => {
		const { updatePreferences } = this.props

		updatePreferences({
			items: {
				filter: value
			}
		})

		this.setState({ classAnchor: undefined })
	}

	render() {
		const { itemPreferences, intl } = this.props
		const { classAnchor } = this.state

		return (
			<div className={style.itemActionBar}>
				<div className={style.leftGroup}>
					<Button
						className={style.filter}
						onClick={event => this.setState({ classAnchor: event.currentTarget })}>
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
						open={Boolean(classAnchor)}
						onClose={() => this.setState({ classAnchor: undefined })}>
						{itemPreferences.filter !== 'ALL' && (
							<MenuItem key="all" onClick={() => this.filter('ALL')} className={style.menuFilter}>
								<T id="item.general.all" />
							</MenuItem>
						)}
						{classes.filter(c => c.classCode !== itemPreferences.filter).map(c => (
							<MenuItem
								key={c.classCode}
								onClick={() => this.filter(c.classCode as ClassCode)}
								className={style.menuFilter}>
								<ImageLoader src={classIcons[c.classCode as ClassCode]} />
								<T id={['general', 'class_names', c.classCode]} />
							</MenuItem>
						))}
					</Menu>
				</div>
				<div className={style.searchContainer}>
					<Input
						disableUnderline
						placeholder={intl.formatMessage({ id: 'item.search_placeholder' })}
						className={style.search}
						value={itemPreferences.search}
						onChange={event => this.search(event.currentTarget.value)}
						endAdornment={
							<>
								{itemPreferences.search.trim() !== '' && (
									<IconButton className={style.clear} onClick={() => this.search('')}>
										<Clear />
									</IconButton>
								)}
							</>
						}
					/>
				</div>
				<div className={style.rightGroup} />
			</div>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		itemPreferences: getItemPreferences(state)
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
)(ItemActionBar)
