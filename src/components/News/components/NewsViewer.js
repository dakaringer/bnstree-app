import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { translate } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { animateScroll } from 'react-scroll'
import Fade from 'react-reveal/Fade'

import { Row, Col } from 'antd'

import AdSense from '../../AdSense/AdSense'
import ErrorMessage from '../../Error/ErrorMessage'
import Article from '../../Editor/components/Article'
import NewsList from './NewsList'

import { loadNameData } from '../../References/actions'
import { articleSelector } from '../selectors'
import { loadArticle } from '../actions'

const mapStateToProps = state => {
    return {
        article: articleSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadNames: lang => dispatch(loadNameData(lang)),
        loadArticle: id => dispatch(loadArticle(id))
    }
}

class NewsViewer extends React.PureComponent {
    componentWillMount() {
        const { loadNames, loadArticle, match } = this.props

        loadNames('en')
        loadArticle(match.params.id)
    }

    componentWillReceiveProps(nextProps) {
        const { loadArticle, match } = this.props
        animateScroll.scrollToTop()

        if (nextProps.match.params.id !== match.params.id) {
            loadArticle(nextProps.match.params.id)
        }
    }

    render() {
        const { t, article } = this.props

        let content = null
        if (article) {
            let time = moment(new Date(article.get('datePosted')))
            let now = moment(new Date())
            let timeString = ''
            if (now.diff(time, 'days') < 1) {
                timeString = time.fromNow()
            } else {
                timeString = time.format('LL')
            }

            let thumb =
                article.get('thumb') !== '' ? (
                    <div className="main-thumb-container">
                        <img
                            className="main-thumb"
                            alt={article.get('thumb')}
                            src={`https://static.bnstree.com/images/thumbnails/${article.get(
                                'thumb'
                            )}.jpg`}
                        />
                    </div>
                ) : null

            content = (
                <div>
                    <h1 className="news-title">{article.get('title')}</h1>
                    <p className="news-timestamp">{timeString}</p>
                    <hr />
                    {thumb}
                    <Article article={article} />
                </div>
            )
        } else {
            content = <ErrorMessage />
        }

        return (
            <div>
                <Helmet>
                    <title>{`${article ? article.get('title') : 'Not Found'} - ${t(
                        'news'
                    )} | BnSTree`}</title>
                    <meta
                        name="description"
                        content={article ? article.get('content', '').split('\n\n')[0] : ''}
                    />
                </Helmet>
                <Row className="news-viewer" gutter={16}>
                    <Col md={18}>
                        <Fade>
                            <div className="news-article">{content}</div>
                        </Fade>
                    </Col>
                    <Col className="news-list-side" md={6}>
                        <div>
                            <h3>More Articles</h3>
                            <hr />
                            <NewsList currentId={article ? article.get('_id') : ''} icon />
                            <AdSense
                                data-ad-format="fluid"
                                data-ad-layout="in-article"
                                data-ad-client="ca-pub-2048637692232915"
                                data-ad-slot="5474542711"
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(NewsViewer))
