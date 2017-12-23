import React from 'react'
import {translate} from 'react-i18next'

import icon from '../images/GameUI_HeaderIcon_230.png'

const NewsHeader = props => {
    const {t} = props

    return (
        <div className="news-header section-header">
            <div className="header-title">
                <img alt="news" src={icon} />
                <span>{t('news')}</span>
            </div>
        </div>
    )
}

export default translate('general')(NewsHeader)
