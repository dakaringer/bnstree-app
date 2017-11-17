import React from 'react'
import {translate} from 'react-i18next'
import {connect} from 'react-redux'
import {Link, NavLink, withRouter} from 'react-router-dom'
import {Map} from 'immutable'
import {Fade} from 'react-reveal'

import {currentLanguageSelector, userSelector, supportedLanguagesSelector} from '../../selectors'
import {setUILanguage} from '../../actions'

import './styles/NavBar.scss'

import mainLogo from './images/logo.png'
import gLogo from './images/g-logo.png'

import {Collapse, Avatar} from 'antd'
const Panel = Collapse.Panel

export const classes = [
    ['BM', 'blade-master'],
    ['KF', 'kung-fu-master'],
    ['DE', 'destroyer'],
    ['FM', 'force-master'],
    ['AS', 'assassin'],
    ['SU', 'summoner'],
    ['BD', 'blade-dancer'],
    ['WL', 'warlock'],
    ['SF', 'soul-fighter'],
    ['SH', 'gunslinger']
]

const mapStateToProps = state => {
    return {
        currentLang: currentLanguageSelector(state),
        user: userSelector(state),
        languages: supportedLanguagesSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setLanguage: lang => dispatch(setUILanguage(lang))
    }
}

class NavBar extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            menuOpen: false,
            dropdownStatus: null,
            dropdownPosition: {}
        }
    }

    openCloseMenu() {
        let overlayOpen = this.state.menuOpen
        document.body.classList.toggle('noscroll', !overlayOpen)
        this.setState({
            menuOpen: !overlayOpen
        })
    }

    closeMenu() {
        document.body.classList.toggle('noscroll', false)
        this.setState({
            menuOpen: false,
            dropdownStatus: null
        })
    }

    handleDropdown(dropdown, e) {
        let {dropdownPosition} = this.state
        if (e) {
            let target = e.target
            if (e.target.tagName === 'LI') {
                target = e.target.getElementsByTagName('a')[0]
            }

            dropdownPosition[dropdown] = target.getBoundingClientRect().left
        }
        this.setState({
            dropdownStatus: dropdown,
            dropdownPosition: dropdownPosition
        })
    }

    render() {
        const {t, currentLang, user, setLanguage, languages} = this.props
        const {dropdownStatus, menuOpen} = this.state

        let classDropdown = []
        classes.forEach(c => {
            classDropdown.push(
                <li key={c[0]} onClick={() => this.closeMenu()}>
                    <NavLink to={`/skills/${c[1]}`}>{t(c)}</NavLink>
                </li>
            )
        })

        let searchDropdown = (
            <li>
                <ul>
                    <li>
                        <NavLink to="/market">{t('market')}</NavLink>
                    </li>
                    <li>
                        <NavLink to="/character">{t('character')}</NavLink>
                    </li>
                </ul>
            </li>
        )

        let languageDropdown = []
        languages.forEach(lang => {
            let id = lang.get('_id', 'en')
            if (id !== currentLang) {
                languageDropdown.push(
                    <li key={id} onClick={() => this.closeMenu()}>
                        <a onClick={() => setLanguage(id)}>{lang.get('name', 'English')}</a>
                    </li>
                )
            }
        })

        let loginDropdown = (
            <li>
                {user ? (
                    <ul>
                        {user.getIn(['role', 'translator']) ? (
                            <li onClick={() => this.closeMenu()}>
                                <NavLink to="/translator">Translator Console</NavLink>
                            </li>
                        ) : null}
                        <li>
                            <a href="https://api.bnstree.com/user/logout" key="logout">
                                {t('logout')}
                            </a>
                        </li>
                    </ul>
                ) : (
                    <div className="google-login">
                        <a
                            href={`https://api.bnstree.com/user/login?r=${window.location
                                .protocol}//${window.location.host + window.location.pathname}`}>
                            <span className="img-wrap">
                                <img alt="google" src={gLogo} />
                            </span>
                            <span className="google-text">Sign in with Google</span>
                        </a>
                    </div>
                )}
            </li>
        )

        return (
            <Fade className="main-nav-wrapper">
                <div className="main-nav" onMouseLeave={() => this.handleDropdown(null)}>
                    <div className={`dropdown-backdrop ${dropdownStatus ? 'active' : ''}`}>
                        <ul
                            className={`dropdown-content double ${dropdownStatus === 'skills'
                                ? 'active'
                                : ''}`}
                            style={{left: this.state.dropdownPosition.skills}}>
                            {classDropdown}
                        </ul>
                        <ul
                            className={`dropdown-content ${dropdownStatus === 'search'
                                ? 'active'
                                : ''}`}
                            style={{left: this.state.dropdownPosition.search}}>
                            {searchDropdown}
                        </ul>
                        <ul
                            className={`dropdown-content ${dropdownStatus === 'login'
                                ? 'active'
                                : ''}`}
                            style={{left: this.state.dropdownPosition.login}}>
                            {loginDropdown}
                        </ul>
                        <ul
                            className={`dropdown-content ${dropdownStatus === 'language'
                                ? 'active'
                                : ''}`}
                            style={{left: this.state.dropdownPosition.language}}>
                            {languageDropdown}
                        </ul>
                    </div>
                    <div className="main-nav-header">
                        <Link to="/" onClick={() => this.closeMenu()}>
                            <img className="main-nav-logo" src={mainLogo} alt="main" />
                        </Link>
                    </div>
                    <div className="main-nav-right">
                        <Fade down duration={100} cascade tag="ul" className="main-nav-menu">
                            <li
                                className="main-nav-menu-item"
                                onMouseOver={() => this.handleDropdown(null)}>
                                <NavLink to="/news">{t('news')}</NavLink>
                            </li>
                            <li
                                className={`main-nav-menu-item ${dropdownStatus === 'skills'
                                    ? 'dropdown-active'
                                    : ''}`}
                                onMouseOver={e => this.handleDropdown('skills', e)}>
                                <a
                                    className={
                                        this.props.location.pathname.startsWith('/skills')
                                            ? 'active'
                                            : ''
                                    }>
                                    {t('skills')}
                                </a>
                            </li>
                            <li
                                className={`main-nav-menu-item ${dropdownStatus === 'search'
                                    ? 'dropdown-active'
                                    : ''}`}
                                onMouseOver={e => this.handleDropdown('search', e)}>
                                <a
                                    className={
                                        this.props.location.pathname.startsWith('/market') ||
                                        this.props.location.pathname.startsWith('/character')
                                            ? 'active'
                                            : ''
                                    }>
                                    {t('search')}
                                </a>
                            </li>
                            <li
                                className="main-nav-menu-item"
                                onMouseOver={() => this.handleDropdown(null)}>
                                <NavLink to="/streams">{t('streams')}</NavLink>
                            </li>
                        </Fade>
                        <ul className="main-nav-menu main-nav-submenu">
                            <li
                                className={`main-nav-menu-item ${dropdownStatus === 'login'
                                    ? 'dropdown-active'
                                    : ''}`}
                                onMouseOver={e => this.handleDropdown('login', e)}>
                                <a>
                                    {user ? (
                                        <Avatar
                                            style={{backgroundColor: 'deepskyblue'}}
                                            src={user.get('profilePic')}>
                                            {user.get('displayName', 'U').charAt(0)}
                                        </Avatar>
                                    ) : (
                                        t('login')
                                    )}
                                </a>
                            </li>
                            <li
                                className={`main-nav-menu-item ${dropdownStatus === 'language'
                                    ? 'dropdown-active'
                                    : ''}`}
                                onMouseOver={e => this.handleDropdown('language', e)}>
                                <a>
                                    {languages
                                        .find(l => l.get('_id', 'en') === currentLang, null, Map())
                                        .get('name', 'English')}
                                </a>
                            </li>
                        </ul>
                        <span className="nav-toggle">
                            <button
                                onClick={() => this.openCloseMenu()}
                                className={`hamburger hamburger--squeeze ${menuOpen
                                    ? 'is-active'
                                    : ''}`}
                                type="button">
                                <span className="hamburger-box">
                                    <span className="hamburger-inner" />
                                </span>
                            </button>
                        </span>
                    </div>
                </div>
                <div className="overlay-menu" aria-hidden={!menuOpen}>
                    <div className="overlay-menu-container">
                        <NavLink
                            to="/news"
                            className="overlay-nav-menu-item"
                            onClick={() => this.closeMenu()}>
                            {t('news')}
                        </NavLink>
                        <Collapse bordered={false} className="overlay-nav-menu-item">
                            <Panel header={t('skills')}>
                                <ul>{classDropdown}</ul>
                            </Panel>
                        </Collapse>
                        <Collapse bordered={false} className="overlay-nav-menu-item">
                            <Panel header={t('search')}>
                                <ul>{searchDropdown}</ul>
                            </Panel>
                        </Collapse>
                        <NavLink
                            to="/streams"
                            className="overlay-nav-menu-item"
                            onClick={() => this.closeMenu()}>
                            {t('streams')}
                        </NavLink>
                        <hr />
                        <Collapse bordered={false} className="login overlay-nav-menu-item">
                            <Panel
                                header={
                                    user ? (
                                        <span>
                                            <Avatar
                                                size="small"
                                                style={{backgroundColor: 'deepskyblue'}}
                                                src={user.get('profilePic')}>
                                                U
                                            </Avatar>
                                            {user.get('displayName')}
                                        </span>
                                    ) : (
                                        t('login')
                                    )
                                }>
                                <ul>{loginDropdown}</ul>
                            </Panel>
                        </Collapse>
                        <Collapse bordered={false} className="language overlay-nav-menu-item">
                            <Panel
                                header={languages
                                    .find(l => l.get('_id', 'en') === currentLang, null, Map())
                                    .get('name', 'English')}>
                                <ul>{languageDropdown}</ul>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            </Fade>
        )
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(translate('general')(NavBar))
)
