import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {NavLink, withRouter} from 'react-router-dom'

import {Icon, Popover} from 'antd'

import {classes} from '../../NavBar/NavBar'
import classImages from '../images/map_classImg'

import {classSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        classCode: classSelector(state)
    }
}

const ClassHeader = props => {
    const {t, classCode, location} = props

    let currentPath = location.pathname.split('/').slice(-1)[0]

    let classLinks = []
    classes.forEach(c => {
        classLinks.push(
            <NavLink
                to={`/classes/${c[1]}/${currentPath !== c[1] ? currentPath : ''}`}
                className="class-link"
                key={c[0]}>
                <img alt={c[1]} src={classImages[c[0]]} />
                <p>
                    {t(c[0])}
                </p>
            </NavLink>
        )
    })

    return (
        <div className="class-header section-header">
            <div className="header-title class-selector">
                <Popover
                    trigger="click"
                    placement="bottomRight"
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
        </div>
    )
}

export default withRouter(connect(mapStateToProps)(translate('general')(ClassHeader)))
