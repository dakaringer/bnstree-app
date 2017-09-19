import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {Map} from 'immutable'
import {BrowserRouter, Route} from 'react-router-dom'
import rootReducer from './rootReducer'
import {setUILanguage} from './actions'

import './styles/index.scss'

import {LocaleProvider} from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import i18n from './i18n'
import {I18nextProvider} from 'react-i18next'

import ReactGA from 'react-ga'
ReactGA.initialize('UA-61749626-5')

const composeEnhancers = composeWithDevTools({})
let store = createStore(rootReducer, Map(), composeEnhancers(applyMiddleware(thunk)))

const withTracker = WrappedComponent => {
    const trackPage = page => {
        ReactGA.set({page})
        ReactGA.pageview(page)
    }

    const HOC = props => {
        const page = props.location.pathname
        trackPage(page)

        return <WrappedComponent {...props} />
    }

    return HOC
}

class Root extends React.PureComponent {
    componentDidMount() {
        let lang = navigator.language.substring(0, 2)
        store.dispatch(setUILanguage(lang, true))
    }

    render() {
        return (
            <LocaleProvider locale={enUS}>
                <Provider store={store}>
                    <I18nextProvider i18n={i18n}>
                        <BrowserRouter>
                            <Route component={withTracker(App)} />
                        </BrowserRouter>
                    </I18nextProvider>
                </Provider>
            </LocaleProvider>
        )
    }
}

ReactDOM.render(<Root />, document.getElementById('root'))
registerServiceWorker()
