import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Typography, ListItem } from '@material-ui/core'

import { googleYoloConfig, googleAuthConfig } from './config'
import UserActions from '@src/store/User/actions'

import * as style from './styles/Menu.css'
import { LinkObject } from './links'
import GoogleLogo from './images/GoogleLogo.svg'
import GoogleLogoPressed from './images/GoogleLogo-pressed.svg'
import T from '@src/components/T'

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

interface State {}

class LoginButton extends React.PureComponent<Props, State> {
	login = () => {
		if (!_googleYolo) {
			return this.openSubMenu()
		}

		const retrievePromise = _googleYolo.retrieve(googleYoloConfig)
		retrievePromise
			.then((credentials: any) => this.authenticate(credentials.idToken))
			.catch((error: any) => {
				if (error.type === 'userCanceled') return
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
							onClick={() => {
								resetMenu()
								this.oauthLogin()
							}}
							classes={{ root: style.googleLoginButton }}>
							<span className={style.googleLogoContainer}>
								<GoogleLogo className={style.googleLogo} height={40} width={40} />
								<GoogleLogoPressed className={style.googleLogoPressed} height={40} width={40} />
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
			<ListItem button onClick={this.login} className={style.loginButton}>
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
