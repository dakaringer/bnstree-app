import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import MarkdownIt from 'markdown-it'
import {Map} from 'immutable'
import {Link} from 'react-router-dom'
import {translate} from 'react-i18next'
import {Helmet} from 'react-helmet'

import {Row, Col, Button} from 'antd'

import AdSense from '../../AdSense/AdSense'

import NewsList from './NewsList'

import {skillNamesSelector} from '../../Classes/selectors'
import {loadTextData} from '../../Classes/actions'
import {articleSelector} from '../selectors'
import {loadArticle} from '../actions'

const mapStateToProps = state => {
    return {
        skillNames: skillNamesSelector(state),
        article: articleSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadText: lang => dispatch(loadTextData(lang)),
        loadArticle: id => dispatch(loadArticle(id))
    }
}

class NewsViewer extends React.Component {
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
        const {t, article, skillNames} = this.props

        let content = null
        if (article.has('title')) {
            let md = new MarkdownIt()

            let time = moment(article.get('datePosted'))
            let now = moment(new Date())
            let timeString = ''
            if (now.diff(time, 'days') < 1) {
                timeString = time.fromNow()
            } else {
                timeString = time.format('LL')
            }

            let renderedContent = article
                .get('content', '')
                .replace(/\[skill]\((\w+-?\w+)\)/g, (match, id) => {
                    let skill = skillNames.get(id, Map())
                    return `![${id}](https://static.bnstree.com/images/skills/${skill.get(
                        'icon',
                        'blank'
                    )}) **${skill.get('name')}**`
                })

            let thumb =
                article.get('thumb') !== ''
                    ? <img
                          alt={article.get('thumb')}
                          src={`https://static.bnstree.com/images/thumbnails/${article.get(
                              'thumb'
                          )}.jpg`}
                      />
                    : null

            content = (
                <div>
                    <h1 className="news-title">
                        {article.get('title')}
                    </h1>
                    <p className="news-timestamp">
                        {timeString}
                    </p>
                    <hr />
                    {thumb}
                    <div
                        className="news-content"
                        dangerouslySetInnerHTML={{__html: md.render(renderedContent)}}
                    />
                </div>
            )
        }

        return (
            <div>
                <Helmet>
                    <title>{`${article.get('title')} - ${t('news')} | BnSTree`}</title>
                    <meta
                        name="description"
                        content={article.get('content', '').split('\n\n')[0]}
                    />
                </Helmet>
                <Row className="news-viewer">
                    <Col className="news-article" md={{span: 18, push: 6}}>
                        <div>
                            {content}
                            <Link to={`/news/edit/${article.get('_id')}`}>
                                <Button type="primary" ghost>
                                    Edit
                                </Button>
                            </Link>
                            <AdSense
                                data-ad-client="ca-pub-2048637692232915"
                                data-ad-slot="2719129989"
                                data-ad-format="auto"
                            />
                        </div>
                    </Col>
                    <Col className="news-list-side" md={{span: 6, pull: 18}}>
                        <div>
                            <h3>More Articles</h3>
                            <hr />
                            <NewsList currentId={article.get('_id')} />
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
