import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import {Link} from 'react-router-dom'
import {translate} from 'react-i18next'
import {Helmet} from 'react-helmet'
import {Fade} from 'react-reveal'

import {Row, Col, Button} from 'antd'

import AdSense from '../../AdSense/AdSense'
import ErrorMessage from '../../Error/ErrorMessage'
import Article from '../../Editor/components/Article'
import NewsList from './NewsList'

import {userSelector} from '../../../selectors'
import {skillNamesSelectorEN} from '../../Skills/selectors'
import {loadTextData} from '../../Skills/actions'
import {articleSelector} from '../selectors'
import {loadArticle} from '../actions'

const mapStateToProps = state => {
    return {
        user: userSelector(state),
        skillNames: skillNamesSelectorEN(state),
        article: articleSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadText: lang => dispatch(loadTextData(lang)),
        loadArticle: id => dispatch(loadArticle(id))
    }
}

class NewsViewer extends React.PureComponent {
    componentWillMount() {
        const {loadText, loadArticle, match} = this.props

        loadText('en')
        loadArticle(match.params.id)
    }
    componentWillReceiveProps(nextProps) {
        const {loadArticle, match} = this.props

        if (nextProps.match.params.id !== match.params.id) {
            loadArticle(nextProps.match.params.id)
        }
    }

    render() {
        const {t, article, user} = this.props

        let content = null
        let editButton = null
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

            if (user && user.getIn(['role', 'type']) === 'admin') {
                editButton = (
                    <Link to={`/editor/${article.get('_id')}`}>
                        <Button type="primary" ghost>
                            Edit
                        </Button>
                    </Link>
                )
            }
        } else {
            content = <ErrorMessage />
        }

        return (
            <Fade>
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
                        <div className="news-article">
                            {content}
                            {editButton}
                        </div>
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
            </Fade>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(NewsViewer))
