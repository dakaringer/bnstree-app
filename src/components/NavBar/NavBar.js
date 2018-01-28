import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, NavLink, withRouter } from 'react-router-dom'
import { Map } from 'immutable'
import { Avatar } from 'antd'

import { currentLanguageSelector, userSelector, supportedLanguagesSelector } from '../../selectors'
import { closeMenu, handleDropdown, toggleMenu } from './actions'
import { menuStatusSelector } from './selectors'

import './styles/NavBar.scss'

import mainLogo from './images/logo.png'

import NavBarDropdown from './components/NavBarDropdown'
import NavBarDropdownLink from './components/NavBarDropdownLink'
import NavBarMobileMenu from './components/NavBarMobileMenu'

const mapStateToProps = state => {
    return {
        languages: supportedLanguagesSelector(state),
        currentLang: currentLanguageSelector(state),
        user: userSelector(state),
        menuStatus: menuStatusSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleMenu: () => dispatch(toggleMenu()),
        closeMenu: () => dispatch(closeMenu()),
        closeDropdown: () => dispatch(handleDropdown(null))
    }
}

const NavBar = props => {
    const {
        t,
        currentLang,
        user,
        languages,
        menuStatus,
        toggleMenu,
        closeMenu,
        closeDropdown,
        location
    } = props

    return (
        <div className="main-nav-wrapper">
            <div className="main-nav" onMouseLeave={() => closeDropdown(null)}>
                <NavBarDropdown />
                <div className="main-nav-header">
                    <Link to="/" onClick={() => closeMenu()}>
                        <img className="main-nav-logo" src={mainLogo} alt="main" />
                    </Link>
                </div>
                <div className="main-nav-right">
                    <ul className="main-nav-menu">
                        <li className="main-nav-menu-item" onMouseOver={() => closeDropdown(null)}>
                            <NavLink to="/news">{t('news')}</NavLink>
                        </li>
                        <NavBarDropdownLink
                            dropdown="skills"
                            pathname={['/skills']}
                            location={location}>
                            {t('skills')}
                        </NavBarDropdownLink>
                        <NavBarDropdownLink
                            dropdown="items"
                            pathname={['/items']}
                            location={location}>
                            {t('items')}
                        </NavBarDropdownLink>
                        <NavBarDropdownLink
                            dropdown="search"
                            pathname={['/character', '/market']}
                            location={location}>
                            {t('search')}
                        </NavBarDropdownLink>
                        <li className="main-nav-menu-item" onMouseOver={() => closeDropdown(null)}>
                            <NavLink to="/streams">{t('streams')}</NavLink>
                        </li>
                    </ul>
                    <ul className="main-nav-menu main-nav-submenu">
                        <NavBarDropdownLink dropdown="user" location={location}>
                            {user ? (
                                <Avatar
                                    shape="square"
                                    style={{ backgroundColor: 'deepskyblue' }}
                                    src={user.get('profilePic')}>
                                    {user.get('displayName', 'U').charAt(0)}
                                </Avatar>
                            ) : (
                                    t('login')
                                )}
                        </NavBarDropdownLink>
                        <NavBarDropdownLink dropdown="language" location={location}>
                            {languages
                                .find(l => l.get('_id', 'en') === currentLang, null, Map())
                                .get('name', 'English')}
                        </NavBarDropdownLink>
                    </ul>
                    <span className="nav-toggle">
                        <button
                            onClick={() => toggleMenu()}
                            className={`hamburger hamburger--squeeze ${
                                menuStatus ? 'is-active' : ''
                                }`}
                            type="button">
                            <span className="hamburger-box">
                                <span className="hamburger-inner" />
                            </span>
                        </button>
                    </span>
                </div>
            </div>
            <NavBarMobileMenu />
        </div>
    )
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(translate('general')(NavBar))
)
