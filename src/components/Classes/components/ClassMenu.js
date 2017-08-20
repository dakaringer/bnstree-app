import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {NavLink, withRouter} from 'react-router-dom'

import AdSense from '../../AdSense/AdSense'

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
        <div>
            <div className="class-menu side-bar">
                <div className="class-menu-item">
                    <NavLink to={`/classes/${classCode}`} exact>
                        {t('skills')}
                    </NavLink>
                </div>
                <div className="class-menu-item sub">
                    <NavLink to={`/classes/${classCode}/builds`}>
                        {t('userBuilds')}
                    </NavLink>
                </div>
                {user
                    ? <div className="class-menu-item sub">
                          <NavLink to={`/classes/${classCode}/my-builds`} exact>
                              {t('myBuilds')}
                          </NavLink>
                      </div>
                    : null}
                <div className="class-menu-item">
                    <NavLink to={`/classes/${classCode}/soulshields`}>
                        {t('soulshields')}
                    </NavLink>
                </div>
                <div className="class-menu-item">
                    <NavLink to={`/classes/${classCode}/badges`}>
                        {t('badges')}
                    </NavLink>
                </div>
            </div>
            <AdSense
                data-ad-format="fluid"
                data-ad-layout="in-article"
                data-ad-client="ca-pub-2048637692232915"
                data-ad-slot="5474542711"
            />
        </div>
    )
}

export default withRouter(connect(mapStateToProps)(translate('skills')(SkillMenu)))
