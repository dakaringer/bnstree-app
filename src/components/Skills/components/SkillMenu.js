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

    /*
        <NavLink to={`/classes/${classCode}/info`} className="skill-menu-item">
            {t('classInfo')}
        </NavLink>
    */

    return (
        <div className="skill-menu side-bar">
            <NavLink to={`/classes/${classCode}`} exact className="skill-menu-item">
                {t('skills')}
            </NavLink>
            <NavLink to={`/classes/${classCode}/builds`} className="skill-menu-item sub">
                {t('userBuilds')}
            </NavLink>
            {user
                ? <NavLink
                      to={`/classes/${classCode}/myBuilds`}
                      exact
                      className="skill-menu-item sub">
                      {t('myBuilds')}
                  </NavLink>
                : null}
        </div>
    )
}

export default withRouter(connect(mapStateToProps)(translate('skills')(SkillMenu)))
