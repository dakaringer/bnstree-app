import React from 'react'
import { connect } from 'react-redux'

import { dropdownStatusSelector } from '../selectors'
import { handleDropdown } from '../actions'

const mapStateToProps = state => {
    return {
        dropdownStatus: dropdownStatusSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        handleDropdown: (dropdown, e) => dispatch(handleDropdown(dropdown, e))
    }
}

const NavBarDropdownLink = props => {
    let { pathname, dropdown, dropdownStatus, location, handleDropdown } = props

    let active = false
    if (pathname) {
        pathname.forEach(p => {
            active = active || location.pathname.startsWith(p)
        })
    }

    return (
        <li className={`main-nav-menu-item ${dropdownStatus === pathname ? 'dropdown-active' : ''}`}>
            <a className={active ? 'active' : ''} onMouseOver={e => handleDropdown(dropdown, e)}>{props.children}</a>
        </li>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarDropdownLink)
