import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { ListItem, Avatar } from '@material-ui/core'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { UserData } from '@src/store/User/types'
import UserActions from '@src/store/User/actions'

import style from './styles/Menu.css'
import { LinkObject } from './links'

interface PropsFromDispatch {
	logout: typeof UserActions.logout
}

interface Props extends PropsFromDispatch {
	userData: DeepReadonly<UserData>
	onSelect: (linkObject: LinkObject) => void
}

class UserButton extends React.PureComponent<Props> {
	onSelect = () => {
		const { onSelect, logout } = this.props

		onSelect({
			link: 'user',
			label: 'User',
			subMenu: [
				{
					link: 'logout',
					label: 'Logout',
					render: resetMenu => (
						<ListItem
							button
							onClick={() => {
								resetMenu()
								logout()
							}}>
							<T id="navigation.user.logout" />
						</ListItem>
					)
				}
			]
		})
	}

	render = () => {
		const { userData } = this.props

		return (
			<ListItem button className={style.userButton} onClick={this.onSelect}>
				<Avatar src={userData.profileImg} className={style.avatar} />
				{userData.displayName}
			</ListItem>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ logout: UserActions.logout }, dispatch)

export default connect(
	null,
	mapDispatchToProps
)(UserButton)
