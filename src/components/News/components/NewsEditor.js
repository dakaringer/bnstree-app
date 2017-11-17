import React from 'react'
import {connect} from 'react-redux'
import MarkdownIt from 'markdown-it'
import {translate} from 'react-i18next'
import {Map} from 'immutable'

import {skillNamesSelectorEN} from '../../Skills/selectors'
import {loadTextData} from '../../Skills/actions'
import {editorArticleSelector, editorSavedSelector} from '../selectors'
import {loadArticle, updateEditorArticle, saveArticle, deleteArticle} from '../actions'

import {Row, Col, Button} from 'antd'

const mapStateToProps = state => {
    return {
        skillNames: skillNamesSelectorEN(state),
        article: editorArticleSelector(state),
        saved: editorSavedSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadText: lang => dispatch(loadTextData(lang)),
        loadArticle: id => dispatch(loadArticle(id, true)),
        updateArticle: (context, value) => dispatch(updateEditorArticle(context, value)),
        saveArticle: () => dispatch(saveArticle()),
        deleteArticle: () => dispatch(deleteArticle())
    }
}

class Editor extends React.PureComponent {
    componentWillMount() {
        const {loadText, loadArticle, match} = this.props

        loadText('en')
        loadArticle(match.params.id)
    }

    render() {
        let {skillNames, article, saved, updateArticle, saveArticle, deleteArticle} = this.props

        let md = new MarkdownIt('default', {
            breaks: true,
            html: true
        })

        let renderedContent = article
            .get('content', '')
            .replace(/\[skill]\((\w+(-\w+)*)\)/g, (match, id) => {
                let skill = skillNames.get(id, Map())
                return `**![${id}](https://static.bnstree.com/images/skills/${skill.get(
                    'icon',
                    'blank'
                )}) ${skill.get('name')}**`
            })

        return (
            <div className="editor">
                <Row gutter={24}>
                    <Col sm={12} className="content-editor">
                        <div className="form">
                            <input
                                className="title"
                                placeholder="Title"
                                value={article.get('title', '')}
                                onChange={e => updateArticle('title', e.target.value)}
                            />
                            <textarea
                                className="content"
                                value={article.get('content', '')}
                                placeholder="Content"
                                onChange={e => updateArticle('content', e.target.value)}
                            />
                            <input
                                className="bg"
                                value={article.get('thumb', '')}
                                placeholder="Thumbnail"
                                onChange={e => updateArticle('thumb', e.target.value)}
                            />
                        </div>
                        {saved ? <p>Saved</p> : null}
                        <a onClick={() => saveArticle()}>
                            <Button ghost type="primary">
                                Save
                            </Button>
                        </a>
                        {article.get('_id') ? (
                            <a onClick={() => deleteArticle()}>
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
