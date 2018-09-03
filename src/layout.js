import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'
import {Link, NavLink, Route, Switch, Redirect} from 'react-router-dom'

import AdSense from './components/shared/adsense'

import {Dropdown, Menu, Icon, Badge, Collapse} from 'antd'
const Panel = Collapse.Panel

import googleLogin from './btn_google_signin.png'

import './styles/main.scss'

import {uiTextSelector, jobTextSelector, currentLanguageSelector, userSelector} from './selector'
import {setLanguageUI, setUser} from './actions'

import Background from './background'
import Loading from './components/shared/components/loading/container'

const mapStateToProps = (state) => {
    return {
        classNames: jobTextSelector(state),
        uiText: uiTextSelector(state).get('GENERAL_NAV', Map()),
        currentLanguage: currentLanguageSelector(state),
        user: userSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setLanguage: (lang) => dispatch(setLanguageUI(lang)),
        setUser: (user) => dispatch(setUser(user))
    }
}

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
                <Loading/>
            </div>
        }
    }
}

const Home = asyncComponent(() =>
    System.import('./components/home/container').then(module => module.default)
)

/*
const TrainerLegacy = asyncComponent(() =>
    System.import('./components/trainer/container').then(module => module.default)
)
*/

const Trainer = asyncComponent(() =>
    System.import('./components/trainer2/container').then(module => module.default)
)

const Mixer = asyncComponent(() =>
    System.import('./components/mixer/container').then(module => module.default)
)

const Character = asyncComponent(() =>
    System.import('./components/character/container').then(module => module.default)
)

const Rankings = asyncComponent(() =>
    System.import('./components/rankings/container').then(module => module.default)
)

const Article = asyncComponent(() =>
    System.import('./components/article/container').then(module => module.default)
)

const Editor = asyncComponent(() =>
    System.import('./components/editor/container').then(module => module.default)
)

const Archive = asyncComponent(() =>
    System.import('./components/archive/container').then(module => module.default)
)

const Error404 = asyncComponent(() =>
    System.import('./components/error/container').then(module => module.default)
)

class Layout extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            region: 'na',
            characterName: '',
            menuOpen: false
        }
    }

    login() {
        window.location.href = `/login?r=${window.location.pathname}`
    }

    logout() {
        this.props.setUser(null)
        window.location.href = `/logout?r=${window.location.pathname}`
    }

    select(link) {
        this.props.history.push(link)
        this.setState({
            menuOpen: false
        })
    }

    changeRegion(e) {
        this.setState({
            region: e.target.value,
            menuOpen: false
        })
    }

    enterCharacter(e) {
        this.setState({characterName: e.target.value})
    }

    openCloseMenu() {
        let overlayOpen = this.state.menuOpen
        document.body.classList.toggle('noscroll', !overlayOpen)
        this.setState({
            menuOpen: !overlayOpen
        })
    }

    render() {
        let classLinks = []
        this.props.classNames.forEach((val) => {
            classLinks.push(
                <Menu.Item key={val.id} className={this.props.match.params.classCode == val.id && this.props.location.pathname.startsWith('/tree') ? 'active' : ''}>
                    <a href={`/tree/${val.id}`} onClick={e => e.preventDefault()}>{val.name}</a>
                </Menu.Item>
            )
        })

        let classLinks2 = []
        this.props.classNames.forEach((val) => {
            classLinks2.push(
                <Menu.Item key={val.id} className={this.props.match.params.classCode == val.id && this.props.location.pathname.startsWith('/skill') ? 'active' : ''}>
                    <a href={`/skill/${val.id}`} onClick={e => e.preventDefault()}>{val.name}</a>
                </Menu.Item>
            )
        })

        let classMenu2 = <Menu onClick={(e) => this.select(`/skill/${e.key}`)} theme='dark'>
            {classLinks2}
        </Menu>

        let characterMenu = <Menu onClick={(e) => this.select(`/${e.key}`)} theme='dark'>
            <Menu.Item key='character' className={this.props.location.pathname.startsWith('/character') ? 'active' : ''}>
                <a href='/character' onClick={e => e.preventDefault()}>{this.props.uiText.get('search')}</a>
            </Menu.Item>
            <Menu.Item key='rankings' className={this.props.location.pathname.startsWith('/rankings') ? 'active' : ''}>
                <a href='/rankings' onClick={e => e.preventDefault()}>{this.props.uiText.get('rankings')}</a>
            </Menu.Item>
        </Menu>

        let params = new URLSearchParams(this.props.location.search)
        let testLanguages = null
        if (params.get('test')!= null) {
            testLanguages = <Menu.Item className={this.props.currentLanguage == 'ru' ? 'active' : ''} key='ru'><a>ру́сский</a></Menu.Item>
        }

        let languages = <Menu onClick={(e) => this.props.setLanguage(e.key)} theme='dark'>
            <Menu.Item className={this.props.currentLanguage == 'en' ? 'active' : ''} key='en'><a>English</a></Menu.Item>
            <Menu.Item className={this.props.currentLanguage == 'ko' ? 'active' : ''} key='ko'><a>한국어</a></Menu.Item>
            {testLanguages}
        </Menu>

        let loginButton = <a className='main-nav-menu-item loginButton' id='User' onClick={() => this.login()}>
            <img src={googleLogin}/>
        </a>
        if (this.props.user) {
            let profilePic = null
            if (this.props.user.get('profilePic', null)) {
                profilePic = <img className='profilePic' src={this.props.user.get('profilePic')}/>
            }
            let userMenu = <Menu onClick={(e) => this.props.setLanguage(e.key)}>
                <Menu.Item disabled>Profile</Menu.Item>
                <Menu.Item><a onClick={() => this.logout()}>Logout</a></Menu.Item>
            </Menu>

            loginButton = <Dropdown overlay={userMenu} trigger={['click']}>
                <a className='main-nav-menu-item nav-profile' id='User'>
                    {profilePic}{this.props.user.get('displayName')}
                </a>
            </Dropdown>
        }

        let year = new Date().getFullYear()

        let navTransparent = this.props.location.pathname.startsWith('/news')
        let navHome = this.props.location.pathname === '/'

        return (
            <div className='layout'>
                <div className={`main-nav ${navTransparent ? 'transparent' : ''} ${navHome ? 'home' : ''}`}>
                    <span className='main-nav-header'>
                        <Link to='/'>
                            <img src='/images/logo.png'/>
                        </Link>
                    </span>
                    <span className='main-nav-right'>
                        <span className='nav-toggle'>
                            <button onClick={() => this.openCloseMenu()} className={`hamburger hamburger--squeeze ${this.state.menuOpen ? 'is-active' : ''}`} type='button'>
                                <span className='hamburger-box'>
                                    <span className='hamburger-inner'></span>
                                </span>
                            </button>
                        </span>
                        <span className='main-nav-menu'>
                            <Dropdown overlay={classMenu2}>
                                <a className={`main-nav-menu-item ${this.props.location.pathname.startsWith('/skill') ? 'active' : ''}`}>
                                    {this.props.uiText.get('skills', '')} <Icon type="down" />
                                </a>
                            </Dropdown>
                            <NavLink className={'main-nav-menu-item'} to='/soulshield'>
                                {this.props.uiText.get('soulshield', '')}
                            </NavLink>
                            <Dropdown overlay={characterMenu}>
                                <a className={`main-nav-menu-item ${this.props.location.pathname.startsWith('/character') || this.props.location.pathname.startsWith('/rankings') ? 'active' : ''}`}>
                                    {this.props.uiText.get('character', '')} <Icon type="down" />
                                </a>
                            </Dropdown>
                            <Dropdown overlay={languages} trigger={['click']}>
                                <a className='main-nav-menu-item' id='languages'>
                                    <Badge count={this.props.currentLanguage.toUpperCase()}>
                                        <span> <Icon type="global" /> </span>
                                    </Badge>
                                </a>
                            </Dropdown>
                            {loginButton}
                        </span>
                    </span>
                </div>
                <div className='layout-content'>
                    <div className='appContent'>
                        <Switch>
                            <Route exact path='/' component={Home}/>

                            <Redirect exact from='/skill' to='/skill/BM'/>
                            <Route exact path='/skill/:classCode' component={Trainer}/>
                            <Route exact path='/skill/:classCode/:buildLink' component={Trainer}/>

                            <Route path='/soulshield' component={Mixer}/>

                            <Route exact path='/character' component={Character}/>
                            <Route exact path='/character/:region' component={Character}/>
                            <Route exact path='/character/:region/:name' component={Character}/>

                            <Route exact path='/rankings' component={Rankings}/>

                            <Route exact path='/news' component={Archive}/>
                            <Route exact path='/news/:articleId' component={Article}/>

                            <Route path='/edit' component={Editor}/>

                            <Route component={Error404}/>
                        </Switch>
                    </div>
                    <Background/>
                    <div className='remaining-content'>
                        <div className='container adspace'>
                            <AdSense client="ca-pub-2048637692232915" slot="2719129989" format='auto'/>
                        </div>
                    </div>
                    <footer>
                        <div className='footer'>
                            <p>Copyright &copy; {year} BnSTree. All rights reserved.</p>
                        </div>
                    </footer>
                </div>
                <div className='overlayMenu' aria-hidden={!this.state.menuOpen}>
                    <div className='overlayMenuContainer'>
                        <Collapse bordered={false}>
                            <Panel header={this.props.uiText.get('skills', '')}>
                                {classMenu2}
                            </Panel>
                        </Collapse>
                        <a className={`overlay-nav-menu-item ${this.props.location.pathname.startsWith('/soulshield') ? 'active' : ''}`} onClick={() => this.select('/soulshield')}>
                            {this.props.uiText.get('soulshield', '')}
                        </a>
                        <Collapse bordered={false}>
                            <Panel header={this.props.uiText.get('character', '')}>
                                {characterMenu}
                            </Panel>
                        </Collapse>
                        <Collapse bordered={false}>
                            <Panel header={<span> <Icon type="global" /> </span>}>
                                {languages}
                            </Panel>
                        </Collapse>
                        {loginButton}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
