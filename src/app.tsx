import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteProps } from 'react-router'
import { Snackbar, Typography } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { IntlProvider } from 'react-intl'
import compose from '@src/utils/compose'

import Router from './router'
import GATracker from './GATracker'
import T from '@components/T'
import Navigation from '@components/Navigation'
import Background from '@components/Background'
import LoadingLyn from '@components/LoadingLyn'
import { ThemeProvider } from '@style/styled-components'
import { muiTheme, styledTheme } from '@style/theme'

import Actions from '@store/rootActions'
import UserActions from '@store/User/actions'
import { RootState } from '@store/rootReducer'
import { getIsLoading } from '@store/rootSelector'
import { getLocale, getFlatMessages } from '@store/Intl/selectors'
import { getLogoutMessage } from '@store/User/selectors'

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
						<ThemeProvider theme={styledTheme}>
							<MuiThemeProvider theme={muiTheme}>
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
						</ThemeProvider>
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
	hot,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(App)
