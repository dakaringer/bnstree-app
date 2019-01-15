import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Typography, ListItem } from '@material-ui/core'

import T from '@components/T'
import { LinkObject } from '@components/Navigation/links'

import UserActions from '@store/User/actions'

import { ProfileButton, GoogleLogo, GoogleLogoPressed, GoogleLoginButton } from './style'
import { googleYoloConfig, googleAuthConfig } from './config'

declare global {
	interface Window {
		onGoogleYoloLoad: any
		gapi: any
	}
}

let _googleYolo: any = null
let _googleAuth: any = null

window.onGoogleYoloLoad = (yolo: any) => {
	_googleYolo = yolo
}
window.gapi.load('auth2', () => {
	_googleAuth = window.gapi.auth2.init(googleAuthConfig)
})

interface PropsFromDispatch {
	login: typeof UserActions.idTokenLogin
}

interface Props extends PropsFromDispatch {
	onSelect: (linkObject: LinkObject) => void
}

class LoginButton extends React.PureComponent<Props> {
	login = () => {
		if (!_googleYolo) {
			return this.openSubMenu()
		}

		const retrievePromise = _googleYolo.retrieve(googleYoloConfig)
		retrievePromise
			.then((credentials: any) => this.authenticate(credentials.idToken))
			.catch((error: any) => {
				if (error.type === 'userCanceled') {
					return
				}
				const hintPromise = _googleYolo.hint(googleYoloConfig)
				hintPromise
					.then((credentials: any) => this.authenticate(credentials.idToken))
					.catch((err: any) => {
						if (err.type === 'noCredentialsAvailable') {
							this.openSubMenu()
						} else {
							_googleYolo.cancelLastOperation()
						}
					})
			})
	}

	oauthLogin = () => {
		_googleAuth.signIn().then((user: any) => {
			this.authenticate(user.getAuthResponse().id_token)
		})
	}

	authenticate = (idToken: string) => {
		const { login } = this.props
		login(idToken)
	}

	openSubMenu = () => {
		const { onSelect } = this.props

		onSelect({
			link: 'login',
			label: 'Login',
			subMenu: [
				{
					link: 'google',
					label: 'Sign in with Google',
					render: resetMenu => (
						<ListItem
							button
							component={GoogleLoginButton}
							onClick={() => {
								resetMenu()
								this.oauthLogin()
							}}>
							<span>
								<GoogleLogo />
								<GoogleLogoPressed />
							</span>
							<Typography component="span" color="inherit" variant="body2">
								Sign in with Google
							</Typography>
						</ListItem>
					)
				}
			]
		})
	}

	render = () => {
		return (
			<ListItem button component={ProfileButton} onClick={this.login}>
				<Typography variant="button">
					<T id="navigation.user.login" />
				</Typography>
			</ListItem>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ login: UserActions.idTokenLogin }, dispatch)

export default connect(
	null,
	mapDispatchToProps
)(LoginButton)
