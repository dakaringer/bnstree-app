import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {NavLink, withRouter} from 'react-router-dom'

import {Icon, Popover, Menu, Dropdown} from 'antd'

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

class ClassHeader extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            popover: false
        }
    }

    handlePopover(state) {
        this.setState({
            popover: state
        })
    }

    render() {
        const {t, classCode, user, location, match} = this.props

        let currentPath = location.pathname.split('/').slice(-1)[0]

        let classLinks = []
        classes.forEach(c => {
            classLinks.push(
                <NavLink
                    to={`/skills/${c[1]}${currentPath !== match.params.classCode
                        ? `/${currentPath}`
                        : ''}`}
                    className="class-link"
                    onClick={() => this.handlePopover(false)}
                    key={c[0]}>
                    <img alt={c[1]} src={classImages[c[0]]} />
                    <p>{t(c[0])}</p>
                </NavLink>
            )
        })

        let builds = (
            <Menu theme="dark">
                <Menu.Item>
                    <NavLink
                        className="class-menu-item sub"
                        to={`/skills/${match.params.classCode}/builds`}>
                        {t('userBuilds')}
                    </NavLink>
                </Menu.Item>
                <Menu.Item>
                    {user ? (
                        <NavLink
                            className="class-menu-item sub"
                            to={`/skills/${match.params.classCode}/my-builds`}
                            exact>
                            {t('myBuilds')}
                        </NavLink>
                    ) : null}
                </Menu.Item>
            </Menu>
        )

        let subMenu = (
            <div className="class-header-menu">
                <Dropdown overlay={builds}>
                    <NavLink
                        className="class-menu-item"
                        to={`/skills/${match.params.classCode}`}
                        exact>
                        {t('skills')} <Icon type="down" />
                    </NavLink>
                </Dropdown>
                <NavLink
                    className="class-menu-item"
                    to={`/skills/${match.params.classCode}/soulshields`}>
                    {t('soulshields')}
                </NavLink>
                <NavLink
                    className="class-menu-item"
                    to={`/skills/${match.params.classCode}/badges`}>
                    {t('badges')}
                </NavLink>
            </div>
        )

        return (
            <div className="class-header section-header">
                <div className="header-title class-selector">
                    <Popover
                        placement="bottomLeft"
                        visible={this.state.popover}
                        onVisibleChange={visible => this.handlePopover(visible)}
                        content={<div className="class-selector-popover">{classLinks}</div>}>
                        <img alt={classCode} src={classImages[classCode]} />
                        <div>
                            {t(classCode)} <Icon type="down" />
                        </div>
                    </Popover>
                </div>
                <div className="header-right">
                    {subMenu}
                    <Popover trigger="click" placement="bottomRight" content={subMenu}>
                        <a className="popover-toggle">
                            <Icon type="ellipsis" />
                        </a>
                    </Popover>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps)(translate(['classes', 'general'])(ClassHeader)))
