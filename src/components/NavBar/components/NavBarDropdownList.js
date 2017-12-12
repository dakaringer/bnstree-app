import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {NavLink} from 'react-router-dom'

import {closeMenu} from '../actions'

const mapDispatchToProps = dispatch => {
    return {
        closeMenu: () => dispatch(closeMenu())
    }
}

const NavBarDropdownList = props => {
    let {t, list, pathname = '', className, style, closeMenu} = props

    let dropdown = []
    list.forEach(item => {
        dropdown.push(
            <li key={item[0]}>
                <NavLink to={`${pathname}/${item[1]}`} onClick={() => closeMenu()}>
                    {t(item)}
                </NavLink>
            </li>
        )
    })

    return (
        <ul className={className} style={style}>
            {dropdown}
        </ul>
    )
}

export default connect(null, mapDispatchToProps)(translate('general')(NavBarDropdownList))
