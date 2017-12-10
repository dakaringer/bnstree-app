import React from 'react'
import {connect} from 'react-redux'

import {updateArticle} from '../actions'

const mapDispatchToProps = dispatch => {
    return {
        updateArticle: (context, value) => dispatch(updateArticle(context, value))
    }
}

const EditorTextArea = props => {
    let {article, updateArticle} = props

    return (
        <textarea
            className="editor-content"
            value={article.get('content', '')}
            placeholder="Editor"
            onChange={e => updateArticle('content', e.target.value)}
        />
    )
}

export default connect(null, mapDispatchToProps)(EditorTextArea)
