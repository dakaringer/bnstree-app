import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, Redirect} from 'react-router-dom'

import {loadingAppSelector, userSelector} from './selectors'

import NavBar from './components/NavBar/NavBar'
import LoadingLyn from './components/LoadingLyn/LoadingLyn'
import Background from './components/Background/Background'
import SoybeanSprite from './components/Sprites/SoybeanSprite/SoybeanSprite'

import classes from './components/NavBar/classes'
import './styles/App.scss'

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
const NotFound = asyncComponent(() =>
    import('./components/Error/NotFound')
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
    render() {
        const {loading, location, user} = this.props

        let redirectLinks = []
        classes.forEach(c => {
            redirectLinks.push(
                <Redirect
                    key={`${c[0]}-skill`}
                    exact
                    from={`/skill/${c[0]}`}
                    to={{
                        search: location.search,
                        pathname: `/skills/${c[1]}`
                    }}
                />,
                <Redirect
                    key={`${c[0]}-skill-id`}
                    exact
                    from={`/skill/${c[0]}/:id`}
                    to={{
                        search: `?id=${location.pathname.split('/').slice(-1)[0]}`,
                        pathname: `/skills/${c[1]}`
                    }}
                />,
                <Redirect
                    key={`${c[0]}-classes`}
                    exact
                    from={`/classes/${c[1]}`}
                    to={{
                        search: location.search,
                        pathname: `/skills/${c[1]}`
                    }}
                />,
                <Redirect
                    key={`${c[0]}-classes-my-builds`}
                    exact
                    from={`/classes/${c[1]}/builds`}
                    to={`/skills/${c[1]}/builds`}
                />,
                <Redirect
                    key={`${c[0]}-classes-my-builds`}
                    exact
                    from={`/classes/${c[1]}/my-builds`}
                    to={`/skills/${c[1]}/my-builds`}
                />,
                <Redirect
                    key={`${c[0]}-classes-badges`}
                    exact
                    from={`/classes/${c[1]}/badges`}
                    to={`/skills/${c[1]}/badges`}
                />,
                <Redirect
                    key={`${c[0]}-classes-soulshields`}
                    exact
                    from={`/classes/${c[1]}/soulshields`}
                    to={`/skills/${c[1]}/soulshields`}
                />
            )
        })

        let year = new Date().getFullYear()

        let app = null
        if (!loading) {
            app = (
                <div className="App">
                    <NavBar />
                    <div className="app-content">
                        <Switch>
                            <Route exact path="/" component={Home} />

                            <Route path="/news" component={News} />
                            <Route path="/skills/:classCode" component={Skills} />
                            <Route path="/items/:type" component={Items} />
                            <Route path="/market" component={Market} />
                            <Route path="/character" component={Character} />
                            <Route path="/streams" component={Streams} />

                            {user && user.getIn(['role', 'translator']) ? (
                                <Route path="/translator" component={Translator} />
                            ) : null}

                            <Route component={NotFound} />
                            <Redirect exact from="/classes" to="/skills/blade-master" />
                            <Redirect from="/classes/shooter" to="/skills/gunslinger" />
                            <Redirect from="/soulshield" to="/classes/blade-master/soulshields" />
                            {redirectLinks}
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
