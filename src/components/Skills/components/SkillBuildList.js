import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {List} from 'immutable'
import moment from 'moment'
import {Link, withRouter} from 'react-router-dom'

import {Pagination, Icon, Dropdown, Menu, Popconfirm} from 'antd'

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
            elementFilter: 'all',
            typeFilter: 'all'
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

    handleFilter(field, value) {
        const {classCode, user} = this.props
        const {elementFilter, typeFilter} = this.state
        this.props.loadBuildList(1, classCode, elementFilter, typeFilter, user)
        this.setState({
            [field]: value
        })
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

            let time = moment(build.get('datePosted'))
            let n = null
            if (now.diff(time, 'days') < 1) {
                n = <span className="new">N</span>
            }

            let timeString = ''
            if (now.diff(time, 'days') < 1) {
                timeString = time.fromNow()
            } else {
                timeString = time.format('LL')
            }

            let del = null
            if (user) {
                del = (
                    <Popconfirm
                        title={t('deleteQuestion')}
                        onConfirm={() => this.handleDelete(id)}
                        okText={t('delete')}
                        cancelText={t('cancel')}>
                        <a>
                            {t('delete')}
                        </a>
                    </Popconfirm>
                )
            }

            let mobileTimestamp = (
                <div className="build-timestamp mobile">
                    {timeString}
                </div>
            )

            rows.push(
                <Link
                    to={`/classes/${match.params.classCode}?id=${id}`}
                    onClick={() => loadBuild(id)}
                    key={id}>
                    <div className="build-item">
                        <div className="build-details">
                            <div className="build-type">
                                <img
                                    className="element"
                                    alt={element}
                                    src={elementImages[element]}
                                />
                                {t(build.get('type'))}
                            </div>
                            {mobileTimestamp}
                        </div>
                        <div className="build-title">
                            {build.get('title')}
                            <small>
                                {n}
                            </small>
                        </div>
                        <div className="build-timestamp">
                            {timeString}
                        </div>
                        {del}
                    </div>
                </Link>
            )
        })

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
        let elementFilterDropdown = (
            <Menu theme="dark" onClick={e => this.handleFilter('element', e.key)}>
                {elements}
            </Menu>
        )

        let typeFilterDropdown = (
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
                <div className="build-list">
                    {rows}
                </div>
                <Pagination
                    size="small"
                    total={buildList.get('count', 0)}
                    current={buildList.get('page', 1)}
                    pageSize={buildList.get('limit', 10)}
                    onChange={p => loadBuildList(p, classCode, elementFilter, typeFilter, user)}
                />
            </div>
        )
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(translate('skills')(SkillBuildList))
)
