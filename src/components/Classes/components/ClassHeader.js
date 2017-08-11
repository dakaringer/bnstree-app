import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import classImages from '../images/map_classImg'

import {classSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        classCode: classSelector(state)
    }
}

const SkillHeader = props => {
    const {t, classCode} = props

    return (
        <div className="skill-header section-header">
            <div className="header-title">
                <img alt={classCode} src={classImages[classCode]} />
                <span>
                    {t(classCode)}
                </span>
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(translate('general')(SkillHeader))
