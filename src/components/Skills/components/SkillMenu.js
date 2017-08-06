import React from 'react'
import {translate} from 'react-i18next'
import {NavLink, withRouter} from 'react-router-dom'

const SkillMenu = props => {
    const {t, match} = props

    let classLink = match.params.classCode

    return (
        <div className="skill-menu side-bar">
            <NavLink to={`/skills/${classLink}/info`}>
                {t('classInfo')}
            </NavLink>
            <NavLink to={`/skills/${classLink}`} exact>
                {t('skills')}
            </NavLink>
            <NavLink to={`/skills/${classLink}/builds`}>
                {t('userBuilds')}
            </NavLink>
        </div>
    )
}

export default withRouter(translate('skills')(SkillMenu))
