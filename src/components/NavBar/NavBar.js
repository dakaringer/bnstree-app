import React, {Component} from 'react'
import {translate} from 'react-i18next'
import {connect} from 'react-redux'
import {Dropdown, Menu} from 'antd'
import {Link, NavLink, withRouter} from 'react-router-dom'

import {currentLanguageSelector, userSelector} from '../../selectors'
import {setUILanguage} from '../../actions'

import './styles/NavBar.scss'

import mainLogo from './images/logo.png'
import gLogo from './images/g-logo.png'

import {Collapse} from 'antd'
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
    ['SH', 'shooter']
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

class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menuOpen: false
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

    render() {
        const {t, currentLang, user, setLanguage} = this.props

        let classLinks = []
        classes.forEach(c => {
            classLinks.push(
                <Menu.Item key={c[0]}>
                    <NavLink to={`/classes/${c[1]}`}>
                        {t(c)}
                    </NavLink>
                </Menu.Item>
            )
        })
        let classDropdown = (
            <Menu theme="dark" onClick={() => this.closeMenu()} selectable={false}>
                {classLinks}
            </Menu>
        )

        /*
        let itemDropdown = (
            <Menu theme="dark" onClick={() => this.closeMenu()}>
                <Menu.Item key="soulshield">
                    <NavLink to="/items/soulshield">
                        {t('soulshield')}
                    </NavLink>
                </Menu.Item>
            </Menu>
        )

        let characterDropdown = (
            <Menu theme="dark" onClick={() => this.closeMenu()}>
                <Menu.Item key="search">
                    <NavLink to="/character/search">
                        {t('search')}
                    </NavLink>
                </Menu.Item>
            </Menu>
        )
        */

        let languageLinks = []
        languages.forEach(l => {
            if (l !== currentLang) {
                languageLinks.push(
                    <Menu.Item key={l}>
                        {languageNames[l]}
                    </Menu.Item>
                )
            }
        })
        let languageDropdown = (
            <Menu theme="dark" onClick={e => setLanguage(e.key)} selectable={false}>
                {languageLinks}
            </Menu>
        )

        let loginDropdown = (
            <Menu theme="dark" onClick={e => setLanguage(e.key)} selectable={false}>
                <Menu.Item>
                    {user
                        ? <a href="https://api.bnstree.com/user/logout">
                              {t('logout')}
                          </a>
                        : <a
                              href={`https://api.bnstree.com/user/login?r=${window.location
                                  .protocol}//${window.location.host + window.location.pathname}`}>
                              <div className="google-login">
                                  <span className="img-wrap">
                                      <img alt="google" src={gLogo} />
                                  </span>
                                  <span className="google-text">Sign in with Google</span>
                              </div>
                          </a>}
                </Menu.Item>
            </Menu>
        )

        return (
            <div className="main-nav">
                <div className="main-nav-header">
                    <Link to="/" onClick={() => this.closeMenu()}>
                        <img className="main-nav-logo" src={mainLogo} alt="main" />
                    </Link>
                </div>
                <div className="main-nav-right">
                    <div className="main-nav-menu">
                        <NavLink to="/news" className="main-nav-menu-item">
                            {t('news')}
                        </NavLink>
                        <Dropdown overlay={classDropdown} trigger={['hover']}>
                            <NavLink
                                to={`/classes/${classes[0][1]}`}
                                className="main-nav-menu-item">
                                {t('classes')}
                            </NavLink>
                        </Dropdown>
                        <NavLink to="/character" className="main-nav-menu-item">
                            {t('character')}
                        </NavLink>
                    </div>
                    <div className="main-nav-submenu">
                        <Dropdown overlay={loginDropdown} trigger={['hover', 'click']}>
                            <a className="main-nav-menu-item">
                                {user ? user.get('displayName') : t('login')}
                            </a>
                        </Dropdown>
                        <Dropdown overlay={languageDropdown} trigger={['hover', 'click']}>
                            <a className="main-nav-menu-item">
                                {languageNames[currentLang]}
                            </a>
                        </Dropdown>
                    </div>
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

                <div className="overlay-menu" aria-hidden={!this.state.menuOpen}>
                    <div className="overlay-menu-container">
                        <NavLink
                            to="/news"
                            className="overlay-nav-menu-item"
                            onClick={() => this.closeMenu()}>
                            {t('news')}
                        </NavLink>
                        <Collapse bordered={false}>
                            <Panel header={t('classes')}>
                                {classDropdown}
                            </Panel>
                        </Collapse>
                        <NavLink
                            to="/character"
                            className="overlay-nav-menu-item"
                            onClick={() => this.closeMenu()}>
                            {t('character')}
                        </NavLink>
                        <hr />
                        <Collapse bordered={false} className="login">
                            <Panel header={user ? user.get('displayName') : t('login')}>
                                {loginDropdown}
                            </Panel>
                        </Collapse>
                        <Collapse bordered={false} className="language">
                            <Panel header={languageNames[currentLang]}>
                                {languageDropdown}
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
