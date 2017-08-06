import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {List} from 'immutable'
import moment from 'moment'
import {Link} from 'react-router-dom'

import {Table, Icon, Dropdown} from 'antd'

import elementImages from '../images/map_elementImg'

import {classSelector, buildListSelector} from '../selectors'
import {loadBuildList, loadBuild} from '../actions'

const mapStateToProps = state => {
    return {
        classCode: classSelector(state),
        buildList: buildListSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadBuildList: (page, classCode, element, type) =>
            dispatch(loadBuildList(page, classCode, element, type)),
        loadBuild: buildId => dispatch(loadBuild(null, buildId))
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
        let {classCode, loadBuildList} = this.props

        loadBuildList(1, classCode)
        //loadBuildList(1, classCode, element !== 'all' ? element : null, type !== 'all' ? type : null)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.classCode !== this.props.classCode) {
            this.props.loadBuildList(1, nextProps.classCode)
        }
    }

    render() {
        const {t, buildList, classCode, match, loadBuild, loadBuildList} = this.props

        let now = moment(new Date())
        const columns = [
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

                    return (
                        <span className="time">
                            {timeString}
                        </span>
                    )
                }
            }
        ]

        return (
            <div className="skill-build-list">
                <Table
                    className="build-list"
                    rowKey={record => record._id}
                    showHeader={false}
                    columns={columns}
                    dataSource={buildList.get('list', List()).toJS()}
                    pagination={{
                        size: 'small',
                        total: buildList.get('count', 0),
                        current: buildList.get('page', 1),
                        pageSize: buildList.get('limit', 10),
                        onChange: p => loadBuildList(p, classCode)
                    }}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('skills')(SkillBuildList))
