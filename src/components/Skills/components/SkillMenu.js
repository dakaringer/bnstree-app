import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {NavLink, withRouter} from 'react-router-dom'

import {userSelector} from '../../../selectors'

const mapStateToProps = state => {
    return {
        user: userSelector(state)
    }
}

const SkillMenu = props => {
    const {t, match, user} = props

    let classCode = match.params.classCode

    return (
        <div className="skill-menu side-bar">
            <NavLink to={`/skills/${classCode}/info`}>
                {t('classInfo')}
            </NavLink>
            <NavLink to={`/skills/${classCode}`} exact>
                {t('skills')}
            </NavLink>
            <NavLink to={`/skills/${classCode}/builds`}>
                {t('userBuilds')}
            </NavLink>
            {user
                ? <NavLink to={`/skills/${classCode}/myBuilds`} exact>
                      {t('myBuilds')}
                  </NavLink>
                : null}
        </div>
    )
}

export default withRouter(connect(mapStateToProps)(translate('skills')(SkillMenu)))
