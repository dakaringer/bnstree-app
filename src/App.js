import React, {Component} from 'react'
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
                return <Component {...this.props} />
            }
            return (
                <div className="mainLoading">
                    <LoadingLyn />
                </div>
            )
        }
    }
}

const Home = asyncComponent(() =>
    import('./components/Home/Home').then(module => module.default).catch(e => console.log(e))
)
const News = asyncComponent(() =>
    import('./components/News/News').then(module => module.default).catch(e => console.log(e))
)
const Classes = asyncComponent(() =>
    import('./components/Classes/Classes.js')
        .then(module => module.default)
        .catch(e => console.log(e))
)
const Character = asyncComponent(() =>
    import('./components/Character/Character')
        .then(module => module.default)
        .catch(e => console.log(e))
)
const Streams = asyncComponent(() =>
    import('./components/Streams/Streams').then(module => module.default).catch(e => console.log(e))
)

const mapStateToProps = state => {
    return {
        initialized: initializedSelector(state)
    }
}

class App extends Component {
    render() {
        const {initialized, location} = this.props

        let redirectLinks = []
        classes.forEach(c => {
            redirectLinks.push(
                <Redirect
                    key={c[0]}
                    exact
                    from={`/skill/${c[0]}`}
                    to={{
                        search: location.search,
                        pathname: `/classes/${c[1]}`
                    }}
                />,
                <Redirect
                    key={`${c[0]}-2`}
                    exact
                    from={`/skill/${c[0]}/:id`}
                    to={{
                        search: `?id=${location.pathname.split('/').slice(-1)[0]}`,
                        pathname: `/classes/${c[1]}`
                    }}
                />
            )
        })

        let year = new Date().getFullYear()

        let app = (
            <div className="App">
                <LoadingLyn />
            </div>
        )
        if (initialized) {
            app = (
                <div className="App">
                    <NavBar />
                    <div className="app-content">
                        <Switch>
                            <Route exact path="/" component={Home} />

                            <Route path="/news" component={News} />

                            <Redirect exact from="/classes" to="/classes/blade-master" />
                            {redirectLinks}
                            <Route path="/classes/:classCode" component={Classes} />

                            <Route path="/character" component={Character} />

                            <Redirect from="/soulshield" to="/classes/blade-master/soulshields" />

                            <Route path="/streams" component={Streams} />
                        </Switch>
                    </div>
                </div>
            )
        }

        return (
            <div>
                {app}
                <Background />
                <footer>
                    <div className="footer">
                        <p>
                            Copyright &copy; {year} BnSTree. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        )
    }
}

export default connect(mapStateToProps)(App)
