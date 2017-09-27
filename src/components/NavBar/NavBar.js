import React from 'react'
import {translate} from 'react-i18next'
import {connect} from 'react-redux'
import {Link, NavLink, withRouter} from 'react-router-dom'

import {currentLanguageSelector, userSelector} from '../../selectors'
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

const languages = ['en', 'ko']
const languageNames = {
    en: 'English',
    ko: '한국어'
}

const mapStateToProps = state => {
    return {
        currentLang: currentLanguageSelector(state),
        user: userSelector(state)
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
            dropdownStatus: null
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
            menuOpen: false
        })
    }

    handleDropdown(dropdown) {
        this.setState({
            dropdownStatus: dropdown
        })
    }

    render() {
        const {t, currentLang, user, setLanguage} = this.props

        /*
        let classLinks = []
        classes.forEach(c => {
            classLinks.push(
                <Menu.Item key={c[0]}>
                    <NavLink to={`/classes/${c[1]}`}>{t(c)}</NavLink>
                </Menu.Item>
            )
        })
        let classDropdown = (
            <Menu theme="dark" onClick={() => this.closeMenu()} selectable={false}>
                {classLinks}
            </Menu>
        )
        */
        let classDropdown = []
        classes.forEach(c => {
            classDropdown.push(
                <li key={c[0]} onClick={() => this.closeMenu()}>
                    <NavLink to={`/classes/${c[1]}`}>{t(c)}</NavLink>
                </li>
            )
        })

        let languageDropdown = []
        languages.forEach(l => {
            if (l !== currentLang) {
                languageDropdown.push(
                    <li key={l} onClick={() => this.closeMenu()}>
                        <a onClick={() => setLanguage(l)}>{languageNames[l]}</a>
                    </li>
                )
            }
        })

        let loginDropdown = (
            <li>
                {user ? (
                    <a href="https://api.bnstree.com/user/logout">{t('logout')}</a>
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
            <div>
                <div className="main-nav" onMouseLeave={() => this.handleDropdown(null)}>
                    <div
                        className={`dropdown-backdrop ${this.state.dropdownStatus ? 'active' : ''}`}
                    />
                    <div className="main-nav-header">
                        <Link to="/" onClick={() => this.closeMenu()}>
                            <img className="main-nav-logo" src={mainLogo} alt="main" />
                        </Link>
                    </div>
                    <div className="main-nav-right">
                        <ul className="main-nav-menu">
                            <li
                                className="main-nav-menu-item"
                                onMouseOver={() => this.handleDropdown(null)}>
                                <NavLink to="/news">{t('news')}</NavLink>
                            </li>
                            <li
                                className="main-nav-menu-item"
                                onMouseOver={() => this.handleDropdown('classes')}>
                                <NavLink to={`/classes`}>{t('classes')}</NavLink>
                                <ul
                                    className={`dropdown-content classes ${this.state
                                        .dropdownStatus === 'classes'
                                        ? 'active'
                                        : ''}`}>
                                    {classDropdown}
                                </ul>
                            </li>
                            <li
                                className="main-nav-menu-item"
                                onMouseOver={() => this.handleDropdown(null)}>
                                <NavLink to="/market">{t('market')}</NavLink>
                            </li>
                            <li
                                className="main-nav-menu-item"
                                onMouseOver={() => this.handleDropdown(null)}>
                                <NavLink to="/character">{t('character')}</NavLink>
                            </li>
                            <li
                                className="main-nav-menu-item"
                                onMouseOver={() => this.handleDropdown(null)}>
                                <NavLink to="/streams">{t('streams')}</NavLink>
                            </li>
                        </ul>
                        <ul className="main-nav-menu main-nav-submenu">
                            <li
                                className="main-nav-menu-item"
                                onMouseOver={() => this.handleDropdown('login')}>
                                <a>
                                    {user ? (
                                        <Avatar
                                            style={{backgroundColor: 'dodgerblue'}}
                                            src={user.get('profilePic')}>
                                            U
                                        </Avatar>
                                    ) : (
                                        t('login')
                                    )}
                                </a>
                                <ul
                                    className={`dropdown-content ${this.state.dropdownStatus ===
                                    'login'
                                        ? 'active'
                                        : ''}`}>
                                    {loginDropdown}
                                </ul>
                            </li>
                            <li
                                className="main-nav-menu-item"
                                onMouseOver={() => this.handleDropdown('language')}>
                                <a>{languageNames[currentLang]}</a>
                                <ul
                                    className={`dropdown-content ${this.state.dropdownStatus ===
                                    'language'
                                        ? 'active'
                                        : ''}`}>
                                    {languageDropdown}
                                </ul>
                            </li>
                        </ul>
                        <span className="nav-toggle">
                            <button
                                onClick={() => this.openCloseMenu()}
                                className={`hamburger hamburger--squeeze ${this.state.menuOpen
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
                <div className="overlay-menu" aria-hidden={!this.state.menuOpen}>
                    <div className="overlay-menu-container">
                        <NavLink
                            to="/news"
                            className="overlay-nav-menu-item"
                            onClick={() => this.closeMenu()}>
                            {t('news')}
                        </NavLink>
                        <Collapse bordered={false} className="overlay-nav-menu-item">
                            <Panel header={t('classes')}>
                                <ul>{classDropdown}</ul>
                            </Panel>
                        </Collapse>
                        <NavLink
                            to="/market"
                            className="overlay-nav-menu-item"
                            onClick={() => this.closeMenu()}>
                            {t('market')}
                        </NavLink>
                        <NavLink
                            to="/character"
                            className="overlay-nav-menu-item"
                            onClick={() => this.closeMenu()}>
                            {t('character')}
                        </NavLink>
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
                                                style={{backgroundColor: 'dodgerblue'}}
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
                            <Panel header={languageNames[currentLang]}>
                                <ul>{languageDropdown}</ul>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(translate('general')(NavBar))
)
