import React from 'react'
import {connect} from 'react-redux'
import {Map, List} from 'immutable'

import AdSense from '../../shared/adsense'

import moment from 'moment'

import {uiTextSelector, buildListSelector, jobSelector} from '../selector'
import {currentLanguageSelector} from '../../../selector'
import {replaceBuilds, loadBuildList} from '../actions'

import {Icon, Pagination, message} from 'antd'

const mapStateToProps = (state) => {
    return {
        job: jobSelector(state),
        uiText: uiTextSelector(state).get('BUILD_LIST', Map()),
        buildList: buildListSelector(state),
        locale: currentLanguageSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setBuild: (job, builds) => dispatch(replaceBuilds(job, builds)),
        loadBuildList: (job, page) => dispatch(loadBuildList(job, page))
    }
}

class BuildList extends React.Component {
    applyBuild(i) {
        let build = this.props.buildList.getIn(['list', i, 'builds'], Map())
        let job = this.props.buildList.getIn(['list', i, 'job'])
        this.props.setBuild(job, build)
        message.success(this.props.uiText.get('success', ''), 2)

        fetch('/api/trainer/incrementView', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({job: job, link: this.props.buildList.getIn(['list', i, '_id'])})
        })
    }

    paginate(p) {
        this.props.loadBuildList(this.props.job, p)
    }

    render() {
        moment.locale(this.props.locale)
        let dateObj = new Date()
        let now = moment(dateObj)

        let buildList = this.props.buildList.get('list', List()).map((b, i) => {
            let n = null
            let time = moment(b.get('created'))

            let timeString = ''

            if (now.diff(time, 'days') < 1) {
                n = <span className='new'>N</span>
                timeString = time.fromNow()
            }
            else {
                timeString = time.format('LL')
            }

            return <tr key={i} className='buildEntry'>
                <td>
                    <h4 className='title'><a onClick={() => this.applyBuild(i)}>{b.get('title', '')}</a> <small>{n}</small></h4>
                    <div className='detail'>{b.getIn(['postedBy', 'displayName'], '')} <span>|</span> {timeString}</div>
                </td>
                <td>
                    <p className='viewCount'><Icon type="eye" /> <span>{b.get('view')}</span></p>
                </td>
            </tr>
        })

        return (
            <div className='sub-block'>
                <div className='container'>
                    <AdSense client="ca-pub-2048637692232915" slot="2719129989" format='auto'/>
                    <h2>{this.props.uiText.get('header', '')}</h2>
                    <table className='buildList'>
                        <thead>
                        </thead>
                        <tbody>
                            {buildList}
                        </tbody>
                    </table>
                    <Pagination defaultCurrent={this.props.buildList.get('page', 1)} total={this.props.buildList.get('count', 0)} onChange={(p) => this.paginate(p)}/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildList)
