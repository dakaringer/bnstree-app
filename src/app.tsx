import './hotLoaderConfig'
import { hot } from 'react-hot-loader'
import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteProps } from 'react-router'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Snackbar, Typography } from '@material-ui/core'
import { IntlProvider } from 'react-intl'
import compose from '@src/utils/compose'
import T from '@src/components/T'

import './styles/index.css'
import theme from './styles/theme'

import Actions from '@src/store/rootActions'
import UserActions from '@src/store/User/actions'
import { RootState } from '@src/store/rootReducer'
import { getIsLoading } from '@src/store/rootSelector'
import { getLocale, getFlatMessages } from '@src/store/Intl/selectors'
import { getLogoutMessage } from '@src/store/User/selectors'

import Router from './router'
import GATracker from './GATracker'
import Navigation from '@src/components/Navigation'
import Background from '@src/components/Background'
import LoadingLyn from '@src/components/LoadingLyn'

interface PropsFromStore {
	locale: string
	messages: {}
	logoutMessage: boolean
	isLoading: boolean
}

interface PropsFromDispatch {
	initialize: typeof Actions.initialize
	setLogoutMessage: typeof UserActions.setLogoutMessage
}

interface Props extends PropsFromStore, PropsFromDispatch, RouteProps {}

class App extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props)
		props.initialize()
	}

	render = () => {
		const { locale, messages, logoutMessage, setLogoutMessage, isLoading, location } = this.props

		return (
			<GATracker location={location ? location.pathname : '/'}>
				{isLoading ? (
					<LoadingLyn />
				) : (
					<IntlProvider locale={locale ? locale.toLowerCase() : 'en'} messages={messages}>
						<MuiThemeProvider theme={theme}>
							<Navigation>
								<Router />
							</Navigation>
							<Snackbar
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right'
								}}
								open={logoutMessage}
								autoHideDuration={3000}
								onClose={() => setLogoutMessage(false)}
								message={
									<Typography color="primary">
										<T id="navigation.user.logout_message" />
									</Typography>
								}
							/>
						</MuiThemeProvider>
					</IntlProvider>
				)}
				<Background />
			</GATracker>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		isLoading: getIsLoading(state),
		locale: getLocale(state),
		logoutMessage: getLogoutMessage(state),
		messages: getFlatMessages(state)
	}
}
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			initialize: Actions.initialize,
			setLogoutMessage: UserActions.setLogoutMessage
		},
		dispatch
	)

export default compose<Props, {}>(
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
	hot(module)
)(App)
