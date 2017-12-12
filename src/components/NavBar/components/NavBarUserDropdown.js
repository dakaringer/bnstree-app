import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {NavLink} from 'react-router-dom'

import {userSelector} from '../../../selectors'
import {closeMenu} from '../actions'

import gLogo from '../images/g-logo.png'

const mapStateToProps = state => {
    return {
        user: userSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        closeMenu: () => dispatch(closeMenu())
    }
}

const NavBarUserDropdown = props => {
    let {t, user, className, style, closeMenu} = props

    let dropdown = []
    if (user) {
        if (user.getIn(['role', 'type']) === 'admin') {
            dropdown.push(
                <li key="admin">
                    <NavLink to="/admin" onClick={() => closeMenu()}>
                        Admin Panel
                    </NavLink>
                </li>
            )
        }

        if (user.getIn(['role', 'translator'])) {
            dropdown.push(
                <li key="translator">
                    <NavLink to="/translator" onClick={() => closeMenu()}>
                        Translator Console
                    </NavLink>
                </li>
            )
        }

        dropdown.push(
            <li key="logout">
                <a href="https://api.bnstree.com/user/logout" key="logout">
                    {t('logout')}
                </a>
            </li>
        )
    } else {
        dropdown.push(
            <li className="google-login" key="login">
                <a
                    href={`https://api.bnstree.com/user/login?r=${
                        window.location.protocol
                    }//${window.location.host + window.location.pathname}`}>
                    <span className="img-wrap">
                        <img alt="google" src={gLogo} />
                    </span>
                    <span className="google-text">Sign in with Google</span>
                </a>
            </li>
        )
    }

    return (
        <ul className={className} style={style}>
            {dropdown}
        </ul>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate('general')(NavBarUserDropdown)
)
