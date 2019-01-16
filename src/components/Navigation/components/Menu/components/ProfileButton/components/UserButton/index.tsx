import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { ListItem, Avatar } from '@material-ui/core'

import T from '@components/T'
import { LinkObject } from '@components/Navigation/links'

import { actions as userActions, UserData } from '@store/User'

import { ProfileButton, AvatarComponent } from './style'

interface PropsFromDispatch {
	logout: typeof userActions.logout
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
			<ListItem button component={ProfileButton} onClick={this.onSelect}>
				<Avatar component={AvatarComponent} src={userData.profileImg} />
				{userData.displayName}
			</ListItem>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ logout: userActions.logout }, dispatch)

export default connect(
	null,
	mapDispatchToProps
)(UserButton)
