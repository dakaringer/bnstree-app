import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import MarkdownIt from 'markdown-it'
import {Link} from 'react-router-dom'

import {Row, Col, Button} from 'antd'

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
        const {article, skillNames} = this.props

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

            content = (
                <div>
                    <h1 className="news-title">
                        {article.get('title')}
                    </h1>
                    <p className="news-timestamp">
                        {timeString}
                    </p>
                    <hr />
                    <div
                        className="content"
                        dangerouslySetInnerHTML={{__html: md.render(renderedContent)}}
                    />
                </div>
            )
        }

        return (
            <Row className="news-viewer">
                <Col className="news-article" md={{span: 18, push: 6}}>
                    {content}
                    <Link to={`/news/edit/${article.get('_id')}`}>
                        <Button type="primary" ghost>
                            Edit
                        </Button>
                    </Link>
                </Col>
                <Col className="news-list-side" md={{span: 6, pull: 18}}>
                    <h3>More Articles</h3>
                    <hr />
                    <NewsList currentId={article.get('_id')} />
                </Col>
            </Row>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsViewer)
