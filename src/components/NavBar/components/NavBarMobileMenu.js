import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {NavLink} from 'react-router-dom'
import {Map} from 'immutable'

import {Avatar, Collapse} from 'antd'

import NavBarDropdownList from './NavBarDropdownList'
import NavBarUserDropdown from './NavBarUserDropdown'
import NavBarLanguageDropdown from './NavBarLanguageDropdown'

import classes from '../linkmap_skills'
import items from '../linkmap_items'
import search from '../linkmap_search'

import {currentLanguageSelector, supportedLanguagesSelector, userSelector} from '../../../selectors'
import {menuStatusSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        menuStatus: menuStatusSelector(state),
        user: userSelector(state),
        languages: supportedLanguagesSelector(state),
        currentLanguage: currentLanguageSelector(state)
    }
}

const NavBarMobileMenu = props => {
    let {t, menuStatus, user, languages, currentLanguage} = props

    return (
        <div className="overlay-menu" aria-hidden={!menuStatus}>
            <ul className="overlay-menu-container">
                <NavLink
                    to="/news"
                    className="overlay-nav-menu-item"
                    onClick={() => this.closeMenu()}>
                    {t('news')}
                </NavLink>
                <Collapse bordered={false} className="overlay-nav-menu-item">
                    <Collapse.Panel header={t('skills')}>
                        <NavBarDropdownList list={classes} pathname="/skills" />
                    </Collapse.Panel>
                </Collapse>
                <Collapse bordered={false} className="overlay-nav-menu-item">
                    <Collapse.Panel header={t('items')}>
                        <NavBarDropdownList list={items} pathname="/items" />
                    </Collapse.Panel>
                </Collapse>
                <Collapse bordered={false} className="overlay-nav-menu-item">
                    <Collapse.Panel header={t('search')}>
                        <NavBarDropdownList list={search} />
                    </Collapse.Panel>
                </Collapse>
                <NavLink
                    to="/streams"
                    className="overlay-nav-menu-item"
                    onClick={() => this.closeMenu()}>
                    {t('streams')}
                </NavLink>
                <hr />
                <Collapse bordered={false} className="login overlay-nav-menu-item">
                    <Collapse.Panel
                        header={
                            user ? (
                                <span>
                                    <Avatar
                                        shape="square"
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
                        <NavBarUserDropdown />
                    </Collapse.Panel>
                </Collapse>
                <Collapse bordered={false} className="language overlay-nav-menu-item">
                    <Collapse.Panel
                        header={languages
                            .find(l => l.get('_id', 'en') === currentLanguage, null, Map())
                            .get('name', 'English')}>
                        <NavBarLanguageDropdown />
                    </Collapse.Panel>
                </Collapse>
            </ul>
        </div>
    )
}

export default connect(mapStateToProps)(translate('general')(NavBarMobileMenu))
