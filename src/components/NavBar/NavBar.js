import React, {Component} from 'react'
import {translate} from 'react-i18next'
import {connect} from 'react-redux'
import {Dropdown, Menu} from 'antd'
import {Link, NavLink} from 'react-router-dom'

import {currentLanguageSelector} from '../../selectors'
import {setLanguageUI} from '../../actions'

import './styles/NavBar.scss'

import mainLogo from './images/logo.png'

const classes = ['BM', 'KF', 'DE', 'FM', 'AS', 'SU', 'BD', 'WL', 'SF', 'SH']
const classPaths = {
    'BM': 'blade-master',
    'KF': 'kung-fu-master',
    'DE': 'destroyer',
    'FM': 'force-master',
    'AS': 'assassin',
    'SU': 'summoner',
    'BD': 'blade-dancer',
    'WL': 'warlock',
    'SF': 'soul-fighter',
    'SH': 'shooter'
}

const languages = ['en', 'ko']
const languageNames = {
    'en': 'English',
    'ko': '한국어'
}

const mapStateToProps = (state) => {
    return {
        currentLang: currentLanguageSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setLanguage: (lang) => dispatch(setLanguageUI(lang))
    }
}

class NavBar extends Component {
    render() {
        const {t, currentLang} = this.props

        let classDropdown = []
        classes.forEach(c => {
            classDropdown.push(
                <Menu.Item key={c}>
                    <NavLink to={`/skills/${classPaths[c]}`}>{t(c)}</NavLink>
                </Menu.Item>
            )
        })

        let itemDropdown = <Menu theme='dark'>
            <Menu.Item key='soulshield'>
                <NavLink to='/items/soulshield'>{t('soulshield')}</NavLink>
            </Menu.Item>
        </Menu>

        let characterDropdown = <Menu theme='dark'>
            <Menu.Item key='search'>
                <NavLink to='/character/search'>{t('search')}</NavLink>
            </Menu.Item>
        </Menu>

        let languageDropdown = []
        languages.forEach(l => {
            if (l !== currentLang) {
                languageDropdown.push(
                    <Menu.Item key={l}>
                        {languageNames[l]}
                    </Menu.Item>
                )
            }
        })

        return (
            <div className='main-nav'>
                <div className='main-nav-header'>
                    <Link to='/'>
                        <img className='main-nav-logo' src={mainLogo} alt='main'/>
                    </Link>
                </div>
                <div className='main-nav-right'>
                    <div className='main-nav-menu'>
                        <Dropdown overlay={<Menu theme='dark'>{classDropdown}</Menu>} trigger={['hover', 'click']}>
                            <Link to={`/skill/${classPaths.BM}`} className='main-nav-menu-item'>
                                {t('skills')}
                            </Link>
                        </Dropdown>
                        <Dropdown overlay={itemDropdown} trigger={['hover', 'click']}>
                            <Link to='/items/soulshield' className='main-nav-menu-item'>
                                {t('items')}
                            </Link>
                        </Dropdown>
                        <Dropdown overlay={characterDropdown} trigger={['hover', 'click']}>
                            <Link to='/character/search' className='main-nav-menu-item'>
                                {t('character')}
                            </Link>
                        </Dropdown>
                    </div>
                    <div className='main-nav-submenu'>
                        <Dropdown overlay={<Menu onClick={(e) => this.props.setLanguage(e.key)} theme='dark'>{languageDropdown}</Menu>} trigger={['hover', 'click']}>
                            <a className='main-nav-menu-item'>{languageNames[currentLang]}</a>
                        </Dropdown>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(NavBar))
