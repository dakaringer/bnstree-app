import React from 'react'
import {translate} from 'react-i18next'

import icon from '../images/GameUI_HeaderIcon_02_11.png'

const StreamHeader = props => {
    const {t} = props

    return (
        <div className="stream-header section-header">
            <div className="header-title">
                <img alt="stream" src={icon} />
                <span>
                    {t('streams')}
                </span>
            </div>
        </div>
    )
}

export default translate('general')(StreamHeader)
