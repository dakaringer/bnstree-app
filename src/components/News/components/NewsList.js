import React, {Component} from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {List} from 'immutable'
import moment from 'moment'
import {Link} from 'react-router-dom'

import {Pagination} from 'antd'

import {loadNews} from '../actions'
import {listSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        list: listSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadNews: page => dispatch(loadNews(page))
    }
}

class NewsList extends Component {
    componentWillMount() {
        this.props.loadNews(1)
    }

    render() {
        let {list, loadNews} = this.props

        let rows = []

        let now = moment(new Date())
        list.get('list', List()).forEach(article => {
            let id = article.get('_id')

            let time = moment(article.get('datePosted'))
            let n = null
            let timeString = ''
            if (now.diff(time, 'days') < 1) {
                n = <span className="new">N</span>
                timeString = time.fromNow()
            } else {
                timeString = time.format('LL')
            }

            let thumb = null
            if (article.get('thumb', '') === '') {
                let i = Math.floor(Math.random() * 17 + 1)
                thumb = (
                    <img
                        alt="thumb"
                        className="thumb"
                        src={`https://static.bnstree.com/images/backgrounds/${i}_1.jpg`}
                    />
                )
            } else {
                thumb = (
                    <img
                        alt="thumb"
                        className="thumb"
                        src={`https://static.bnstree.com/images/thumb/${article.get('thumb')}`}
                    />
                )
            }

            rows.push(
                <Link
                    to={`/news/${id}/${article.get('title', '').replace(' ', '-').toLowerCase()}`}
                    key={id}>
                    <div className="news-item list-item">
                        <div className="thumb-wrapper">
                            {thumb}
                        </div>
                        <div className="news-item-content">
                            <div className="news-title">
                                <h3 className="list-item-title">
                                    {article.get('title')}
                                    <small>
                                        {n}
                                    </small>
                                </h3>
                                <h5 className="news-subtitle">
                                    {article.get('content', '').split('\n\n')[0]}
                                </h5>
                            </div>
                            <div className="list-item-timestamp">
                                {timeString}
                            </div>
                        </div>
                    </div>
                </Link>
            )
        })

        return (
            <div className="news-list-container">
                <div className="news-list listing">
                    {rows.length > 0 ? rows : <p className="no-data">No Data</p>}
                </div>
                <Pagination
                    size="small"
                    total={list.get('count', 0)}
                    current={list.get('page', 1)}
                    pageSize={list.get('limit', 10)}
                    onChange={p => loadNews(p)}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(NewsList))
