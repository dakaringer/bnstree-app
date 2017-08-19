import React, {Component} from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {List} from 'immutable'

import {Pagination} from 'antd'

import AdSense from '../../AdSense/AdSense'

import {loadNews} from '../actions'
import {listSelector} from '../selectors'

import NewsListItem from './NewsListItem'

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
        let {list, loadNews, currentId, ad} = this.props

        let rows = []
        list.get('list', List()).forEach((article, i) => {
            rows.push(
                <NewsListItem
                    article={article}
                    key={i}
                    selected={currentId === article.get('_id')}
                />
            )
        })

        return (
            <div className="news-list-container">
                {ad
                    ? <AdSense
                          data-ad-client="ca-pub-2048637692232915"
                          data-ad-slot="6768736382"
                          data-ad-format="auto"
                      />
                    : null}
                <div className="news-list-wrapper">
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
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(NewsList))
