import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'

import { Link } from 'react-router-dom'

import { Pagination, Button } from 'antd'

import { loadNews } from '../../News/actions'
import { listSelector } from '../../News/selectors'

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

class AdminNewsList extends React.PureComponent {
    componentWillMount() {
        this.props.loadNews(1)
    }

    render() {
        let { list, loadNews } = this.props

        let rows = []
        list.get('list', List()).forEach((article, i) => {
            let unpublished = !article.get('published') ? (
                <p className="unpublished">Unpublished</p>
            ) : null

            rows.push(
                <Link to={`/editor/${article.get('_id')}`} className="list-item" key={i}>
                    <h3>{article.get('title')}</h3>
                    <p className="list-item-timestamp">
                        {new Date(article.get('datePosted')).toTimeString()}
                    </p>
                    {unpublished}
                </Link>
            )
        })

        return (
            <div className="admin-news-list">
                <div className="admin-news-submenu">
                    <Button ghost type="primary" size="small">
                        <Link to={'/editor'}>New Article</Link>
                    </Button>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminNewsList)
