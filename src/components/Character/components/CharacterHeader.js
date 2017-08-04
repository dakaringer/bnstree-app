import React from 'react'
import {translate} from 'react-i18next'
import {withRouter} from 'react-router'

import icon from '../images/GameUI_HeaderIcon_160.png'

import CharacterSearch from './CharacterSearch'

const CharacterHeader = props => {
    const {t, location} = props

    return (
        <div className="character-header section-header">
            <div className="header-title">
                <img alt="character" src={icon} />
                <span>
                    {t('character')}
                </span>
            </div>
            <div className="header-item">
                {location.pathname !== '/character' &&
                location.pathname !== '/character/na' &&
                location.pathname !== '/character/eu'
                    ? <CharacterSearch />
                    : null}
            </div>
        </div>
    )
}

export default withRouter(translate('general')(CharacterHeader))
