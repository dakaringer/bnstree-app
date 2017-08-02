import React, {Component} from 'react'
import {translate} from 'react-i18next'
import {connect} from 'react-redux'
import {Dropdown, Menu} from 'antd'
import {Link, NavLink} from 'react-router-dom'

import {currentLanguageSelector} from '../../selectors'
import {setUILanguage} from '../../actions'

import './styles/NavBar.scss'

import mainLogo from './images/logo.png'

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
        currentLang: currentLanguageSelector(state)
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
        this.setState({
            menuOpen: false
        })
    }

    render() {
        const {t, currentLang, setLanguage} = this.props

        let classLinks = []
        classes.forEach(c => {
            classLinks.push(
                <Menu.Item key={c[0]}>
                    <NavLink to={`/skills/${c[1]}`}>
                        {t(c)}
                    </NavLink>
                </Menu.Item>
            )
        })
        let classDropdown = (
            <Menu theme="dark" onClick={() => this.closeMenu()}>
                {classLinks}
            </Menu>
        )

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
            <Menu theme="dark" onClick={e => setLanguage(e.key)}>
                {languageLinks}
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
                        <Dropdown overlay={classDropdown} trigger={['hover', 'click']}>
                            <Link to={`/skills/${classes[0][1]}`} className="main-nav-menu-item">
                                {t('skills')}
                            </Link>
                        </Dropdown>
                        <Dropdown overlay={itemDropdown} trigger={['hover', 'click']}>
                            <Link to="/items/soulshield" className="main-nav-menu-item">
                                {t('items')}
                            </Link>
                        </Dropdown>
                        <Dropdown overlay={characterDropdown} trigger={['hover', 'click']}>
                            <Link to="/character/search" className="main-nav-menu-item">
                                {t('character')}
                            </Link>
                        </Dropdown>
                    </div>
                    <div className="main-nav-submenu">
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

                <div className="overlayMenu" aria-hidden={!this.state.menuOpen}>
                    <div className="overlayMenuContainer">
                        <Collapse bordered={false}>
                            <Panel header={t('skills')}>
                                {classDropdown}
                            </Panel>
                        </Collapse>
                        <Collapse bordered={false}>
                            <Panel header={t('items')}>
                                {itemDropdown}
                            </Panel>
                        </Collapse>
                        <Collapse bordered={false}>
                            <Panel header={t('character')}>
                                {characterDropdown}
                            </Panel>
                        </Collapse>
                        <hr />
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

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(NavBar))
