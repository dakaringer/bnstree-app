import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {List} from 'immutable'
import moment from 'moment'
import {Link} from 'react-router-dom'

import {Pagination, Icon, Dropdown, Menu, Popconfirm} from 'antd'

import elementImages from '../images/map_elementImg2'

import {
    classSelector,
    buildListSelector,
    elementDataSelector,
    userBuildListSelector
} from '../selectors'
import {loadBuildList, loadBuild, deleteBuild} from '../actions'

const mapStateToProps = state => {
    return {
        classCode: classSelector(state),
        buildList: buildListSelector(state),
        userBuildList: userBuildListSelector(state),
        elementData: elementDataSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadBuildList: (page, classCode, element, type, user) =>
            dispatch(loadBuildList(page, classCode, element, type, user)),
        loadBuild: buildId => dispatch(loadBuild(null, buildId)),
        deleteBuild: (buildId, classCode) => dispatch(deleteBuild(buildId, classCode))
    }
}

class SkillBuildList extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            elementFilter: 'all',
            typeFilter: 'all'
        }
    }

    handleFilter(element, type) {
        const {classCode, user, loadBuildList} = this.props
        const {elementFilter, typeFilter} = this.state

        element = element || elementFilter
        type = type || typeFilter

        this.setState({
            elementFilter: element,
            typeFilter: type
        })

        loadBuildList(1, classCode, element, type, user)
    }

    handleDelete(id) {
        let {deleteBuild, classCode} = this.props
        deleteBuild(id, classCode)
    }

    render() {
        const {
            t,
            buildList,
            userBuildList,
            classCode,
            elementData,
            user,
            match,
            loadBuild,
            loadBuildList
        } = this.props
        const {elementFilter, typeFilter} = this.state

        let rows = []
        let list = user ? userBuildList : buildList

        let now = moment(new Date())
        list.get('list', List()).forEach(build => {
            let id = build.get('_id')
            let element = build.get('element')

            let time = moment(new Date(build.get('datePosted')))
            let n = null
            let timeString = ''
            if (now.diff(time, 'days') < 1) {
                n = <span className="new">N</span>
                timeString = time.fromNow()
            } else {
                timeString = time.format('MMM D')
            }

            let del = null
            if (user) {
                del = (
                    <Popconfirm
                        title={t('deleteQuestion')}
                        onConfirm={() => this.handleDelete(id)}
                        okText={t('delete')}
                        cancelText={t('cancel')}>
                        <a className="delete">{t('delete')}</a>
                    </Popconfirm>
                )
            }

            let mobileTimestamp = <div className="list-item-timestamp mobile">{timeString}</div>

            rows.push(
                <div className="build-item list-item" key={id}>
                    <div className="build-details">
                        <div className="build-type">
                            <img className="element" alt={element} src={elementImages[element]} />
                            {t(build.get('type'))}
                        </div>
                        {mobileTimestamp}
                    </div>
                    <Link
                        className="build-title list-item-title"
                        to={`/skills/${match.params.classCode}?id=${id}`}
                        onClick={() => loadBuild(id)}>
                        {build.get('title')}
                        <small>{n}</small>
                    </Link>
                    <div className="list-item-timestamp">{timeString}</div>
                    {del}
                </div>
            )
        })

        let elements = [<Menu.Item key="all">{t('all')}</Menu.Item>]
        elementData.forEach(e => {
            let element = e.get('element')
            elements.push(<Menu.Item key={element}>{t(element)}</Menu.Item>)
        })
        let elementFilterDropdown = (
            <Menu theme="dark" onClick={e => this.handleFilter(e.key, null)}>
                {elements}
            </Menu>
        )

        let typeFilterDropdown = (
            <Menu theme="dark" onClick={e => this.handleFilter(null, e.key)}>
                <Menu.Item key="all">{t('all')}</Menu.Item>
                <Menu.Item key="PvE">{t('PvE')}</Menu.Item>
                <Menu.Item key="PvP">{t('PvP')}</Menu.Item>
                <Menu.Item key="6v6">{t('6v6')}</Menu.Item>
            </Menu>
        )

        return (
            <div className="skill-build-list">
                <div className="skill-build-filter sub-menu">
                    <div className="sub-menu-left">
                        <div className="sub-menu-item">
                            {`${t('element')}: `}
                            <Dropdown overlay={elementFilterDropdown} trigger={['click']}>
                                <a>
                                    {t(elementFilter)} <Icon type="down" />
                                </a>
                            </Dropdown>
                        </div>
                        <div className="sub-menu-item">
                            {`${t('type')}: `}
                            <Dropdown overlay={typeFilterDropdown} trigger={['click']}>
                                <a>
                                    {t(typeFilter)} <Icon type="down" />
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="build-list listing">
                    {rows.length > 0 ? rows : <p className="no-data">No Data</p>}
                </div>
                <Pagination
                    size="small"
                    total={list.get('count', 0)}
                    current={list.get('page', 1)}
                    pageSize={list.get('limit', 10)}
                    onChange={p => loadBuildList(p, classCode, elementFilter, typeFilter, user)}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('classes')(SkillBuildList))
