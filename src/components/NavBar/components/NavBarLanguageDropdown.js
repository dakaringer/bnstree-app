import React from 'react'
import {connect} from 'react-redux'

import {currentLanguageSelector, supportedLanguagesSelector} from '../../../selectors'
import {setUILanguage} from '../../../actions'
import {closeMenu} from '../actions'

const mapStateToProps = state => {
    return {
        languages: supportedLanguagesSelector(state),
        currentLanguage: currentLanguageSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setLanguage: lang => dispatch(setUILanguage(lang)),
        closeMenu: () => dispatch(closeMenu())
    }
}

const NavBarLanguageDropdown = props => {
    let {languages, currentLanguage, setLanguage, className, style, closeMenu} = props

    let dropdown = []
    languages.forEach(lang => {
        let id = lang.get('_id', 'en')
        if (id !== currentLanguage) {
            dropdown.push(
                <li key={id}>
                    <a
                        onClick={() => {
                            closeMenu()
                            setLanguage(id)
                        }}>
                        {lang.get('name', 'English')}
                    </a>
                </li>
            )
        }
    })

    return (
        <ul className={className} style={style}>
            {dropdown}
        </ul>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarLanguageDropdown)
