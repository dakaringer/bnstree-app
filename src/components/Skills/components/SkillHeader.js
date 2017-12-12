import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {NavLink} from 'react-router-dom'

import {Icon, Popover} from 'antd'

import classes from '../../NavBar/linkmap_skills'
import classImages from '../images/map_classImg'

import {userSelector} from '../../../selectors'
import {classSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        classCode: classSelector(state),
        user: userSelector(state)
    }
}

class SkillHeader extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            popover: false,
            popover2: false
        }
    }

    handlePopover(type, open) {
        let state = {}
        state[type] = open
        this.setState(state)
    }

    render() {
        const {t, classCode, user, location, match} = this.props

        let currentPath = location.pathname.split('/').slice(-1)[0]

        let classLinks = []
        classes.forEach(c => {
            classLinks.push(
                <NavLink
                    to={`/skills/${c[1]}${
                        currentPath !== match.params.classCode ? `/${currentPath}` : ''
                    }`}
                    className="class-link"
                    onClick={() => this.handlePopover('popover', false)}
                    key={c[0]}>
                    <img alt={c[1]} src={classImages[c[0]]} />
                    <p>{t(c[0])}</p>
                </NavLink>
            )
        })

        let subMenu = (
            <div className="class-header-menu">
                <NavLink
                    className="class-menu-item"
                    to={`/skills/${match.params.classCode}`}
                    onClick={() => this.handlePopover('popover2', false)}
                    exact>
                    {t('skills')}
                </NavLink>
                <NavLink
                    className="class-menu-item"
                    to={`/skills/${match.params.classCode}/builds`}
                    onClick={() => this.handlePopover('popover2', false)}
                    exact>
                    {t('userBuilds')}
                </NavLink>
                {user ? (
                    <NavLink
                        className="class-menu-item"
                        to={`/skills/${match.params.classCode}/my-builds`}
                        onClick={() => this.handlePopover('popover2', false)}
                        exact>
                        {t('myBuilds')}
                    </NavLink>
                ) : null}
            </div>
        )

        return (
            <div className="class-header section-header">
                <div className="header-title class-selector">
                    <Popover
                        placement="bottomLeft"
                        visible={this.state.popover}
                        onVisibleChange={visible => this.handlePopover('popover', visible)}
                        content={<div className="class-selector-popover">{classLinks}</div>}>
                        <img alt={classCode} src={classImages[classCode]} />
                        <div>
                            {t(classCode)} <Icon type="down" />
                        </div>
                    </Popover>
                </div>
                <div className="header-right">
                    {subMenu}
                    <Popover
                        placement="bottomRight"
                        visible={this.state.popover2}
                        onVisibleChange={visible => this.handlePopover('popover2', visible)}
                        content={subMenu}>
                        <a className="popover-toggle">
                            <Icon type="ellipsis" />
                        </a>
                    </Popover>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(translate(['classes', 'general'])(SkillHeader))
