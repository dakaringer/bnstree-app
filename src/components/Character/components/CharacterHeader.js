import React from 'react'
import {translate} from 'react-i18next'
import {withRouter} from 'react-router'

import icon from '../images/GameUI_HeaderIcon_160.png'

import CharacterSearch from './CharacterSearch'

const CharacterHeader = props => {
    const {t, location} = props

    let regex = /^\/character\/?(na|eu)?\/?$/

    return (
        <div className="character-header section-header">
            <div className="header-title">
                <img alt="character" src={icon} />
                <span>
                    {t('characterSearch')}
                </span>
            </div>
            <div className="header-item">
                {regex.test(location.pathname) ? null : <CharacterSearch />}
            </div>
        </div>
    )
}

export default withRouter(translate('general')(CharacterHeader))
