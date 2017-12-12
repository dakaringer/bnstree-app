import React from 'react'
import {connect} from 'react-redux'

import {Button, Checkbox, Popconfirm} from 'antd'

import {articleSelector, statusSelector} from '../selectors'
import {updateArticle, saveArticle, deleteArticle} from '../actions'

const mapStateToProps = state => {
    return {
        article: articleSelector(state),
        status: statusSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateArticle: (context, value) => dispatch(updateArticle(context, value)),
        saveArticle: history => dispatch(saveArticle(history)),
        deleteArticle: history => dispatch(deleteArticle(history))
    }
}

const EditorStatusBar = props => {
    let {article, status, updateArticle, saveArticle, deleteArticle, history} = props

    let statusText = ''
    if (status.get('saving') !== null) {
        statusText = status.get('saving') ? 'Saving' : `Saved ${new Date().toTimeString()}`
    }

    return (
        <div className="editor-status-bar sub-menu">
            <div className="sub-menu-left">
                <div className="article-title sub-menu-item">
                    <input
                        className="title"
                        placeholder="Title"
                        value={article.get('title', '')}
                        onChange={e => updateArticle('title', e.target.value)}
                    />
                </div>
                <div className="article-thumb sub-menu-item">
                    <input
                        className="thumbnail"
                        value={article.get('thumb', '')}
                        placeholder="Thumbnail"
                        onChange={e => updateArticle('thumb', e.target.value)}
                    />
                </div>
                <div className="article-toggle sub-menu-item">
                    <Checkbox
                        defaultChecked={false}
                        size="small"
                        onChange={e => updateArticle('published', e.target.checked)}
                        checked={article.get('published')}>
                        Publish
                    </Checkbox>
                </div>
            </div>
            <div className="sub-menu-right">
                <p className="status">{statusText}</p>
                <Button type="primary" ghost size="small" onClick={() => saveArticle(history)}>
                    Save
                </Button>
                {article.get('_id') ? (
                    <Popconfirm
                        title="Delete?"
                        okText="Delete"
                        okType="danger"
                        onConfirm={() => deleteArticle(history)}>
                        <Button type="danger" ghost size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                ) : null}
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorStatusBar)
