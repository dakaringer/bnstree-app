import { hot } from 'react-hot-loader/root'
import React, { useEffect } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteProps } from 'react-router'
import { create } from 'jss'
import { Snackbar, Typography } from '@material-ui/core'
import { ThemeProvider as MuiThemeProvider, StylesProvider, jssPreset } from '@material-ui/styles'
import { IntlProvider } from 'react-intl'
import compose from '@utils/compose'

import Router from './Router'
import GATracker from './GATracker'
import T from '@components/T'
import Navigation from '@components/Navigation'
import Background from '@components/Background'
import LoadingLyn from '@components/LoadingLyn'
import { ThemeProvider } from '@style/styled-components'
import { muiTheme, styledTheme } from '@style/theme'

import { selectors as rootSelectors, actions as rootActions, RootState } from '@store'
import { selectors as intlSelectors } from '@store/Intl'
import { selectors as userSelectors } from '@store/User'

const jss = create({
	...jssPreset(),
	insertionPoint: document.getElementById('jss-insertion-point') as HTMLElement
})

interface PropsFromStore {
	locale: ReturnType<typeof intlSelectors.getLocale>
	messages: ReturnType<typeof intlSelectors.getFlatMessages>
	showlogoutMessage: ReturnType<typeof userSelectors.getShowLogoutMessage>
	isLoading: ReturnType<typeof rootSelectors.getIsLoading>
}

interface PropsFromDispatch {
	initialize: typeof rootActions.initialize
}

interface Props extends PropsFromStore, PropsFromDispatch, RouteProps {}

const App: React.FC<Props> = props => {
	useEffect(() => {
		props.initialize()
	}, [])

	const { locale, messages, showlogoutMessage, isLoading, location } = props
	return (
		<GATracker location={location ? location.pathname : '/'}>
			<IntlProvider locale={locale ? locale.toLowerCase() : 'en'} messages={messages}>
				<StylesProvider jss={jss}>
					<ThemeProvider theme={styledTheme}>
						<MuiThemeProvider theme={muiTheme}>
							{isLoading ? (
								<LoadingLyn />
							) : (
								<>
									<Navigation>
										<Router />
									</Navigation>
									<Snackbar
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right'
										}}
										open={showlogoutMessage}
										autoHideDuration={3000}
										message={
											<Typography color="primary">
												<T id="navigation.user.logout_message" />
											</Typography>
										}
									/>
								</>
							)}
							<Background />
						</MuiThemeProvider>
					</ThemeProvider>
				</StylesProvider>
			</IntlProvider>
		</GATracker>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		isLoading: rootSelectors.getIsLoading(state),
		locale: intlSelectors.getLocale(state),
		messages: intlSelectors.getFlatMessages(state),
		showlogoutMessage: userSelectors.getShowLogoutMessage(state)
	}
}
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			initialize: rootActions.initialize
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
