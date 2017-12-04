import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {List} from 'immutable'
import {Link} from 'react-router-dom'

import {Row, Col} from 'antd'

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

class HomeNewsList extends React.PureComponent {
    componentWillMount() {
        this.props.loadNews(1)
    }

    render() {
        let {t, list, currentId} = this.props

        let items = []
        let count = 0
        list.get('list', List()).forEach((article, i) => {
            if (count > 5) {
                return false
            }
            count++

            items.push(
                <Col md={count === 1 ? 16 : count === 2 ? 8 : 6} xs={12} key={i} span={24}>
                    <NewsListItem
                        article={article}
                        selected={currentId === article.get('_id')}
                        icon
                    />
                </Col>
            )
        })

        return (
            <div className="home-news-list-container">
                <h3>
                    {t('recentNews')}
                    <small>
                        <Link to="/news" className="more">
                            {t('moreNews')}
                        </Link>
                    </small>
                </h3>
                <Row className="home-news-list listing" gutter={10} type="flex">
                    {items}
                </Row>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(HomeNewsList))
