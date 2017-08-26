import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {NavLink, withRouter} from 'react-router-dom'

import {Icon, Popover} from 'antd'

import {classes} from '../../NavBar/NavBar'
import classImages from '../images/map_classImg'

import {userSelector} from '../../../selectors'
import {classSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        classCode: classSelector(state),
        user: userSelector(state)
    }
}

const ClassHeader = props => {
    const {t, classCode, user, location, match} = props

    let currentPath = location.pathname.split('/').slice(-1)[0]

    let classLinks = []
    classes.forEach(c => {
        classLinks.push(
            <NavLink
                to={`/classes/${c[1]}${currentPath !== match.params.classCode
                    ? `/${currentPath}`
                    : ''}`}
                className="class-link"
                key={c[0]}>
                <img alt={c[1]} src={classImages[c[0]]} />
                <p>
                    {t(c[0])}
                </p>
            </NavLink>
        )
    })

    let subMenu = (
        <div className="class-menu-popover">
            <NavLink className="class-menu-item" to={`/classes/${match.params.classCode}`} exact>
                {t('skills')}
            </NavLink>
            <NavLink
                className="class-menu-item sub"
                to={`/classes/${match.params.classCode}/builds`}>
                {t('userBuilds')}
            </NavLink>
            {user
                ? <NavLink
                      className="class-menu-item sub"
                      to={`/classes/${match.params.classCode}/my-builds`}
                      exact>
                      {t('myBuilds')}
                  </NavLink>
                : null}
            <hr />
            <NavLink
                className="class-menu-item"
                to={`/classes/${match.params.classCode}/soulshields`}>
                {t('soulshields')}
            </NavLink>
            <NavLink className="class-menu-item" to={`/classes/${match.params.classCode}/badges`}>
                {t('badges')}
            </NavLink>
        </div>
    )

    return (
        <div className="class-header section-header">
            <div className="header-title class-selector">
                <Popover
                    trigger="click"
                    placement="bottomLeft"
                    content={
                        <div className="class-selector-popover">
                            {classLinks}
                        </div>
                    }>
                    <img alt={classCode} src={classImages[classCode]} />
                    <div>
                        {t(classCode)} <Icon type="down" />
                    </div>
                </Popover>
            </div>
            <div className="header-right">
                <Popover trigger="click" placement="bottomRight" content={subMenu}>
                    <a>
                        <Icon type="ellipsis" />
                    </a>
                </Popover>
            </div>
        </div>
    )
}

export default withRouter(connect(mapStateToProps)(translate(['skills', 'general'])(ClassHeader)))
