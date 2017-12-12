import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch} from 'react-router-dom'

import {loadingAppSelector, userSelector} from './selectors'

import NavBar from './components/NavBar/NavBar'
import LoadingLyn from './components/LoadingLyn/LoadingLyn'
import Background from './components/Background/Background'
import SoybeanSprite from './components/Sprites/SoybeanSprite/SoybeanSprite'

import getRedirects from './redirects'

function asyncComponent(getComponent) {
    return class AsyncComponent extends React.PureComponent {
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
    import('./components/Home/Home')
        .then(module => module.default)
        .catch(e => console.error(e))
)
const News = asyncComponent(() =>
    import('./components/News/News')
        .then(module => module.default)
        .catch(e => console.error(e))
)
const Skills = asyncComponent(() =>
    import('./components/Skills/Skills')
        .then(module => module.default)
        .catch(e => console.error(e))
)
const Items = asyncComponent(() =>
    import('./components/Items/Items')
        .then(module => module.default)
        .catch(e => console.error(e))
)
const Market = asyncComponent(() =>
    import('./components/Market/Market')
        .then(module => module.default)
        .catch(e => console.error(e))
)
const Character = asyncComponent(() =>
    import('./components/Character/Character')
        .then(module => module.default)
        .catch(e => console.error(e))
)
const Streams = asyncComponent(() =>
    import('./components/Streams/Streams')
        .then(module => module.default)
        .catch(e => console.error(e))
)
const Translator = asyncComponent(() =>
    import('./components/Translator/Translator')
        .then(module => module.default)
        .catch(e => console.error(e))
)
const Editor = asyncComponent(() =>
    import('./components/Editor/Editor')
        .then(module => module.default)
        .catch(e => console.error(e))
)
const Admin = asyncComponent(() =>
    import('./components/Admin/Admin')
        .then(module => module.default)
        .catch(e => console.error(e))
)

const ErrorMessage = asyncComponent(() =>
    import('./components/Error/ErrorMessage')
        .then(module => module.default)
        .catch(e => console.error(e))
)

const mapStateToProps = state => {
    return {
        loading: loadingAppSelector(state),
        user: userSelector(state)
    }
}

class App extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false
        }
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true})
    }

    render() {
        const {loading, location, user} = this.props

        let year = new Date().getFullYear()

        let app = null
        if (this.state.hasError) {
            app = (
                <div className="App">
                    <div className="app-content">
                        <ErrorMessage error />
                    </div>
                </div>
            )
        } else if (!loading) {
            let redirectLinks = getRedirects(location)

            app = (
                <div className="App">
                    <NavBar />
                    <div className="app-content">
                        <Switch>
                            {redirectLinks}

                            <Route exact path="/" component={Home} />

                            <Route path="/news" component={News} />
                            <Route path="/skills/:classCode" component={Skills} />
                            <Route path="/items/:type" component={Items} />
                            <Route path="/market" component={Market} />
                            <Route path="/character" component={Character} />
                            <Route path="/streams" component={Streams} />

                            {user && user.getIn(['role', 'type']) === 'admin'
                                ? [
                                      <Route exact key="admin" path="/admin" component={Admin} />,
                                      <Route
                                          exact
                                          key="editor-new"
                                          path="/editor"
                                          component={Editor}
                                      />,
                                      <Route
                                          key="editor-edit"
                                          exact
                                          path="/editor/:id"
                                          component={Editor}
                                      />
                                  ]
                                : null}

                            {user && user.getIn(['role', 'translator']) ? (
                                <Route path="/translator" component={Translator} />
                            ) : null}

                            <Route component={ErrorMessage} />
                        </Switch>
                    </div>
                    <SoybeanSprite />
                </div>
            )
        } else {
            app = (
                <div className="App">
                    <LoadingLyn />
                </div>
            )
        }

        return (
            <div>
                {app}
                <Background />
                <footer>
                    <div className="footer">
                        <div className="footer-links">
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://paypal.me/BnSTree">
                                Tip Jar{' '}
                                <span role="img" aria-label="heart">
                                    💙
                                </span>
                            </a>
                        </div>
                        <p>
                            Copyright &copy; {year} BnSTree. Game content and assets are copyrights
                            and/or trademarks of NCSOFT Corporation.
                        </p>
                        <p>BnSTree is not affiliated with NCSOFT Corporation or Team Bloodlust</p>
                    </div>
                </footer>
            </div>
        )
    }
}

export default connect(mapStateToProps)(App)
