import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Route, Switch, Redirect} from 'react-router-dom'

import {initializedSelector} from './selectors'

import NavBar, {classes} from './components/NavBar/NavBar'
import LoadingLyn from './components/LoadingLyn/LoadingLyn'
import Background from './components/Background/Background'

import './styles/App.scss'

function asyncComponent(getComponent) {
    return class AsyncComponent extends Component {
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

const Skills = asyncComponent(() => import('./components/Skills/Skills').then(module => module.default))

const mapStateToProps = (state) => {
    return {
        initialized: initializedSelector(state)
    }
}

class App extends Component {
    render() {
        const {initialized} = this.props
        
        let redirectLinks = []
        classes.forEach(c => {
            redirectLinks.push(
                <Redirect key={c[0]} exact from={`/skill/${c[0]}`} to={`/skill/${c[1]}`}/>
            )
        })

        let app = <div className='App'>
            <LoadingLyn/>
        </div>
        if (initialized) {
            app = <div className='App'>
                <NavBar/>
                <div className='app-content'>
                    <Switch>
                        <Redirect exact from='/skills' to='/skill/blade-master'/>
                        {redirectLinks}
                        <Route exact path='/skills/:classCode' component={Skills}/>
                        <Route exact path='/skills/:classCode/:buildLink' component={Skills}/>
                    </Switch>
                </div>
                <Background/>
            </div>
        }

        return (
            <div>
                {app}
                <Background/>
            </div>
        )
    }
}

export default connect(mapStateToProps)(App);
