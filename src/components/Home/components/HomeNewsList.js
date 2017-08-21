import React, {Component} from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {List} from 'immutable'
import {Link} from 'react-router-dom'

import {loadNews} from '../../News/actions'
import {listSelector} from '../../News/selectors'

import NewsListItem from '../../News/components/NewsListItem'

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

class HomeNewsList extends Component {
    componentWillMount() {
        this.props.loadNews(1)
    }

    render() {
        let {t, list, currentId} = this.props

        let rows = []
        let count = 0
        list.get('list', List()).forEach((article, i) => {
            if (count > 4) {
                return false
            }
            count++

            rows.push(
                <NewsListItem
                    article={article}
                    key={i}
                    selected={currentId === article.get('_id')}
                    icon
                />
            )
        })

        return (
            <div className="home-news-list-container">
                <h4>
                    {t('recentNews')}
                </h4>
                <div className="home-news-list listing">
                    {rows}
                </div>
                <Link to="/news" className="more">
                    {t('moreNews')}
                </Link>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(HomeNewsList))
