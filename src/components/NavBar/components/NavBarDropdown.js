import React from 'react'
import {connect} from 'react-redux'

import {dropdownStatusSelector, dropdownPositionSelector} from '../selectors'

import NavBarDropdownList from './NavBarDropdownList'
import NavBarUserDropdown from './NavBarUserDropdown'
import NavBarLanguageDropdown from './NavBarLanguageDropdown'

import classes from '../linkmap_skills'
import items from '../linkmap_items'
import search from '../linkmap_search'

const mapStateToProps = state => {
    return {
        dropdownStatus: dropdownStatusSelector(state),
        dropdownPosition: dropdownPositionSelector(state)
    }
}

const NavBarDropdown = props => {
    let {dropdownStatus, dropdownPosition} = props
    return (
        <div className={`dropdown-backdrop ${dropdownStatus ? 'active' : ''}`}>
            <NavBarDropdownList
                className={`dropdown-content double ${dropdownStatus === 'skills' ? 'active' : ''}`}
                style={{left: dropdownPosition.get('skills')}}
                list={classes}
                pathname="/skills"
            />
            <NavBarDropdownList
                className={`dropdown-content ${dropdownStatus === 'items' ? 'active' : ''}`}
                style={{left: dropdownPosition.get('items')}}
                list={items}
                pathname="/items"
            />
            <NavBarDropdownList
                className={`dropdown-content ${dropdownStatus === 'search' ? 'active' : ''}`}
                style={{left: dropdownPosition.get('search')}}
                list={search}
            />
            <NavBarUserDropdown
                className={`dropdown-content ${dropdownStatus === 'user' ? 'active' : ''}`}
                style={{left: dropdownPosition.get('user')}}
            />
            <NavBarLanguageDropdown
                className={`dropdown-content ${dropdownStatus === 'language' ? 'active' : ''}`}
                style={{left: dropdownPosition.get('language')}}
            />
        </div>
    )
}

export default connect(mapStateToProps)(NavBarDropdown)
