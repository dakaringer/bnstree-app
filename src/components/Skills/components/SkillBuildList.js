import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {List} from 'immutable'
import moment from 'moment'
import {Link, withRouter} from 'react-router-dom'

import {Table, Icon, Dropdown, Menu, Popconfirm} from 'antd'

import elementImages from '../images/map_elementImg'

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
            element: 'all',
            type: 'all'
        }
    }

    componentWillMount() {
        let {classCode, loadBuildList, user} = this.props
        loadBuildList(1, classCode, null, null, user)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.classCode !== this.props.classCode || this.props.user !== nextProps.user) {
            this.props.loadBuildList(1, nextProps.classCode, null, null, nextProps.user)
        }
    }

    handleFilter(type, value) {
        let {classCode, user} = this.props
        let s = this.state
        s[type] = value
        this.props.loadBuildList(1, classCode, s.element, s.type, user)
        this.setState(s)
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
        const {element, type} = this.state

        let now = moment(new Date())
        let columns = [
            {
                dataIndex: 'element',
                className: 'element',
                render: element => <img alt={element} src={elementImages[element]} />
            },
            {
                dataIndex: 'type',
                className: 'type',
                render: type => t(type)
            },
            {
                dataIndex: 'title',
                className: 'title',
                render: (title, record) => {
                    let time = moment(record.date)
                    let n = null
                    if (now.diff(time, 'days') < 1) {
                        n = <span className="new">N</span>
                    }
                    return (
                        <span className="title">
                            <Link
                                to={`/skills/${match.params.classCode}?id=${record._id}`}
                                onClick={() => loadBuild(record._id)}>
                                {title}
                            </Link>
                            <small>
                                {n}
                            </small>
                        </span>
                    )
                }
            },
            {
                dataIndex: 'date',
                className: 'date',
                render: time => {
                    let timeString = ''
                    time = moment(time)

                    if (now.diff(time, 'days') < 1) {
                        timeString = time.fromNow()
                    } else {
                        timeString = time.format('LL')
                    }

                    return timeString
                }
            }
        ]

        if (user) {
            columns.push({
                className: 'delete',
                render: (text, record) => {
                    return (
                        <Popconfirm
                            title={t('deleteQuestion')}
                            onConfirm={() => this.handleDelete(record._id)}
                            okText={t('delete')}
                            cancelText={t('cancel')}>
                            <a>
                                {t('delete')}
                            </a>
                        </Popconfirm>
                    )
                }
            })
        }

        let elements = [
            <Menu.Item key="all">
                {t('all')}
            </Menu.Item>
        ]
        elementData.forEach(e => {
            let element = e.get('element')
            elements.push(
                <Menu.Item key={element}>
                    {t(element)}
                </Menu.Item>
            )
        })
        let elementFilter = (
            <Menu theme="dark" onClick={e => this.handleFilter('element', e.key)}>
                {elements}
            </Menu>
        )

        let typeFilter = (
            <Menu theme="dark" onClick={e => this.handleFilter('type', e.key)}>
                <Menu.Item key="all">
                    {t('all')}
                </Menu.Item>
                <Menu.Item key="PvE">
                    {t('PvE')}
                </Menu.Item>
                <Menu.Item key="PvP">
                    {t('PvP')}
                </Menu.Item>
                <Menu.Item key="6v6">
                    {t('6v6')}
                </Menu.Item>
            </Menu>
        )

        return (
            <div className="skill-build-list">
                <div className="skill-build-filter sub-menu">
                    <div className="sub-menu-left">
                        <div className="sub-menu-item">
                            {`${t('element')}: `}
                            <Dropdown overlay={elementFilter} trigger={['click']}>
                                <a>
                                    {t(element)} <Icon type="down" />
                                </a>
                            </Dropdown>
                        </div>
                        <div className="sub-menu-item">
                            {`${t('type')}: `}
                            <Dropdown overlay={typeFilter} trigger={['click']}>
                                <a>
                                    {t(type)} <Icon type="down" />
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <Table
                    className="build-list"
                    rowKey={record => record._id}
                    showHeader={false}
                    columns={columns}
                    dataSource={
                        user
                            ? userBuildList.get('list', List()).toJS()
                            : buildList.get('list', List()).toJS()
                    }
                    pagination={{
                        size: 'small',
                        total: buildList.get('count', 0),
                        current: buildList.get('page', 1),
                        pageSize: buildList.get('limit', 10),
                        onChange: p => loadBuildList(p, classCode, element, type, user)
                    }}
                />
            </div>
        )
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(translate('skills')(SkillBuildList))
)
