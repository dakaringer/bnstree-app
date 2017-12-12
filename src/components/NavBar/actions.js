import * as actionType from './actionTypes'
import {makeActionCreator} from '../../helpers'

import {menuStatusSelector, dropdownPositionSelector} from './selectors'

const setMenuStatus = makeActionCreator(actionType.SET_NAVBAR_MENU_STATUS, 'status')
const setDropdownStatus = makeActionCreator(actionType.SET_NAVBAR_DROPDOWN_STATUS, 'status')
const setDropdownPosition = makeActionCreator(actionType.SET_NAVBAR_DROPDOWN_POSITION, 'position')

export function toggleMenu() {
    return (dispatch, getState) => {
        let menuStatus = menuStatusSelector(getState())
        document.body.classList.toggle('noscroll', !menuStatus)
        dispatch(setMenuStatus(!menuStatus))
    }
}

export function closeMenu() {
    return dispatch => {
        document.body.classList.toggle('noscroll', false)
        dispatch(setMenuStatus(false))
        dispatch(setDropdownStatus(null))
    }
}

export function handleDropdown(dropdown, e) {
    return (dispatch, getState) => {
        let dropdownPosition = dropdownPositionSelector(getState())

        if (e) {
            let target = e.target.getElementsByTagName('a')[0]

            if (target) {
                dropdownPosition = dropdownPosition.set(
                    dropdown,
                    target.getBoundingClientRect().left
                )
            }
        }

        dispatch(setDropdownStatus(dropdown))
        dispatch(setDropdownPosition(dropdownPosition))
    }
}
