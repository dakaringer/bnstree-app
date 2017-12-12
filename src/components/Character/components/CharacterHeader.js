import React from 'react'
import {translate} from 'react-i18next'

import icon from '../images/GameUI_HeaderIcon_117.png'

import CharacterSearch from './CharacterSearch'

const CharacterHeader = props => {
    const {t, location, match} = props

    let regex = /^\/character\/?(na|eu|kr)?\/?$/

    return (
        <div className="character-header section-header">
            <div className="header-title">
                <img alt="character" src={icon} />
                <span>{t('characterSearch')}</span>
            </div>
            <div className="header-item">
                {regex.test(location.pathname) ? null : <CharacterSearch match={match} />}
            </div>
        </div>
    )
}

export default translate('general')(CharacterHeader)
