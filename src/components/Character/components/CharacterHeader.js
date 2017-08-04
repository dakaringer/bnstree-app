import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import icon from '../images/GameUI_HeaderIcon_160.png'

import {characterSelector} from '../selectors'

import CharacterSearch from './CharacterSearch'

const mapStateToProps = state => {
    return {
        character: characterSelector(state)
    }
}

const CharacterHeader = props => {
    const {t, character} = props

    return (
        <div className="character-header section-header">
            <div className="header-title">
                <img alt="character" src={icon} />
                <span>
                    {t('character')}
                </span>
            </div>
            <div className="header-item">
                {character.has('general') ? <CharacterSearch /> : null}
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(translate('general')(CharacterHeader))
