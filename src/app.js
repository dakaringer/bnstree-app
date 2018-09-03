import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {Map} from 'immutable'

let ReactGA = require('react-ga')
ReactGA.initialize('UA-61749626-5')

import {BrowserRouter, Route} from 'react-router-dom'

import {LocaleProvider} from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'

import rootReducer from './rootReducer'

import Layout from './layout'

import {initialize} from './actions'

let store = createStore(rootReducer, Map(), compose(applyMiddleware(thunk), window.devToolsExtension
    ? window.devToolsExtension()
    : f => f))

const withTracker = (WrappedComponent) => {
    const trackPage = (page) => {
        ReactGA.set({page})
        ReactGA.pageview(page)
    }

    const HOC = (props) => {
        const page = props.location.pathname
        trackPage(page)

        return (<WrappedComponent {...props}/>)
    }

    return HOC
}

class Root extends React.PureComponent {
    componentDidMount() {
        store.dispatch(initialize())
    }

    render() {
        return (
            <LocaleProvider locale={enUS}>
                <Provider store={store}>
                    <BrowserRouter>
                        <Route component={withTracker(Layout)}/>
                    </BrowserRouter>
                </Provider>
            </LocaleProvider>
        )
    }
}

ReactDOM.render(
    <Root/>, document.getElementById('root'))

if (process.env.NODE_ENV != 'production') {
    module.hot.accept()
}
