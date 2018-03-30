import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
//import localForage from 'localforage'
//import { persistStore } from 'redux-persist'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { Map } from 'immutable'
import { BrowserRouter, Route } from 'react-router-dom'

import i18n from './i18n'
import { I18nextProvider } from 'react-i18next'

import rootReducer from './rootReducer'
import { initialize } from './actions'

import './styles/index.scss'

import ReactGA from 'react-ga'
ReactGA.initialize('UA-61749626-5')
const withTracker = WrappedComponent => {
    const trackPage = page => {
        ReactGA.set({ page })
        ReactGA.pageview(page)
    }

    const HOC = props => {
        const page = props.location.pathname
        trackPage(page)

        return <WrappedComponent {...props} />
    }

    return HOC
}

const composeEnhancers = composeWithDevTools({})
const store = createStore(
    rootReducer,
    Map(),
    composeEnhancers(applyMiddleware(thunk))
)

class Root extends React.PureComponent {
    componentDidMount() {
        let language = navigator.language.substring(0, 2)
        store.dispatch(initialize(language))
    }

    render() {
        return (
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <BrowserRouter>
                        <React.StrictMode>
                            <Route component={withTracker(App)} />
                        </React.StrictMode>
                    </BrowserRouter>
                </I18nextProvider>
            </Provider>
        )
    }
}

ReactDOM.render(<Root />, document.getElementById('root'))
registerServiceWorker()
