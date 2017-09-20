import React from 'react'
import {connect} from 'react-redux'
import MarkdownIt from 'markdown-it'
import {translate} from 'react-i18next'
import {Map} from 'immutable'

import {skillNamesSelector} from '../../Classes/selectors'
import {loadTextData} from '../../Classes/actions'
import {articleSelector} from '../selectors'
import {loadArticle} from '../actions'

import {Row, Col, message, Button} from 'antd'

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

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

class Editor extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            title: '',
            content: '',
            tags: '',
            thumb: '',
            saved: false
        }
    }

    componentWillMount() {
        const {loadText, loadArticle, match} = this.props

        loadText('en')
        loadArticle(match.params.id)
    }
    componentWillReceiveProps(nextProps) {
        const {loadArticle, article, match} = this.props

        if (nextProps.match.params.id !== match.params.id) {
            loadArticle(nextProps.match.params.id)
        }

        if (nextProps.match.params.id && nextProps.article.equals(article)) {
            this.setState({
                id: nextProps.article.get('_id'),
                title: nextProps.article.get('title'),
                content: nextProps.article.get('content'),
                thumb: nextProps.article.get('thumb')
            })
        }
    }

    save() {
        let {t} = this.props
        let {id, title, content, thumb} = this.state
        if (title.trim() !== '') {
            this.setState({
                saved: false
            })
            let article = {
                id: id,
                title: title,
                content: content,
                thumb: thumb
            }

            fetch('https://api.bnstree.com/news', {
                method: 'post',
                credentials: 'include',
                headers: postHeaders,
                body: JSON.stringify(article)
            })
                .then(response => response.json())
                .then(json => {
                    if (json.success === 1) {
                        this.setState({
                            id: json.articleId,
                            saved: true
                        })
                        message.success(t('general:postSuccess'))
                    } else {
                        message.error(t('general:fail'))
                    }
                })
                .catch(e => console.log(e))
        }
    }

    delete() {
        let {t} = this.props
        let {id} = this.state
        if (id) {
            fetch('https://api.bnstree.com/news', {
                method: 'delete',
                credentials: 'include',
                headers: postHeaders,
                body: JSON.stringify({id: id})
            })
                .then(response => response.json())
                .then(json => {
                    if (json.success === 1 && json.result.n === 1) {
                        this.setState({
                            id: null
                        })
                        message.success(t('general:deleteSuccess'))
                    } else {
                        message.error(t('general:fail'))
                    }
                })
                .catch(e => console.log(e))
        }
    }

    onChange(e, field) {
        this.setState({
            [field]: e.target.value,
            saved: false
        })
    }

    render() {
        let {skillNames} = this.props
        let {id, title, content, thumb, saved} = this.state

        let md = new MarkdownIt('default', {
            breaks: true,
            html: true
        })

        let renderedContent = content
            ? content.replace(/\[skill]\((\w+(-\w+)*)\)/g, (match, id) => {
                  let skill = skillNames.get(id, Map())
                  return `**![${id}](https://static.bnstree.com/images/skills/${skill.get(
                      'icon',
                      'blank'
                  )}) ${skill.get('name')}**`
              })
            : ''

        return (
            <div className="editor">
                <Row gutter={24}>
                    <Col sm={12} className="content-editor">
                        <div className="form">
                            <input
                                className="title"
                                placeholder="Title"
                                value={title}
                                onChange={e => this.onChange(e, 'title')}
                            />
                            <textarea
                                className="content"
                                value={content}
                                placeholder="Content"
                                onChange={e => this.onChange(e, 'content')}
                            />
                            <input
                                className="bg"
                                value={thumb}
                                placeholder="Thumbnail"
                                onChange={e => this.onChange(e, 'thumb')}
                            />
                        </div>
                        {saved ? <p>Saved</p> : null}
                        <a onClick={() => this.save()}>
                            <Button ghost type="primary">
                                Save
                            </Button>
                        </a>
                        {id ? (
                            <a onClick={() => this.delete()}>
                                <Button ghost type="danger">
                                    Delete
                                </Button>
                            </a>
                        ) : null}
                    </Col>
                    <Col sm={12} className="preview news-content">
                        <div
                            className="content"
                            dangerouslySetInnerHTML={{__html: md.render(renderedContent)}}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(Editor))
