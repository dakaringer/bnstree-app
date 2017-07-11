import React, { Component } from 'react'
import {connect} from 'react-redux'

import {initializedSelector} from './selectors'

import NavBar from './components/NavBar/NavBar'
import LoadingLyn from './components/LoadingLyn/LoadingLyn'
import Background from './components/Background/Background'

import './styles/App.scss'

function asyncComponent(getComponent) {
    return class AsyncComponent extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                Component: AsyncComponent.Component
            }
        }

        componentWillMount() {
            if (!this.state.Component) {
                getComponent().then(Component => {
                    AsyncComponent.Component = Component
                    this.setState({Component})
                })
            }
        }
        render() {
            const {Component} = this.state
            if (Component) {
                return <Component {...this.props}/>
            }
            return <div className='mainLoading'>
                <LoadingLyn/>
            </div>
        }
    }
}

const mapStateToProps = (state) => {
    return {
        initialized: initializedSelector(state)
    }
}

class App extends Component {
    render() {
        const {initialized} = this.props

        let app = <div className='App'>
            <LoadingLyn/>
        </div>
        if (initialized) {
            app = <div className='App'>
                <NavBar/>
                <div className='app-content'>
                    To get started, edit <code>src/App.js</code> and save to reload.
                </div>
                <Background/>
            </div>
        }

        return app
    }
}

export default connect(mapStateToProps)(App);
