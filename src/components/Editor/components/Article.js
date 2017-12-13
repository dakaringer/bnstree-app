import React from 'react'
import {connect} from 'react-redux'
import MarkdownIt from 'markdown-it'
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItToC from 'markdown-it-table-of-contents'
import {Map} from 'immutable'

import {skillNamesSelectorEN} from '../../Skills/selectors'

const mapStateToProps = state => {
    return {
        skillNames: skillNamesSelectorEN(state)
    }
}

let md = new MarkdownIt('default', {
    breaks: true,
    html: true
})
    .use(MarkdownItMark)
    .use(MarkdownItAnchor)
    .use(MarkdownItToC, {
        includeLevel: [3]
    })

class EditorPreview extends React.PureComponent {
    parseSkill(match, id) {
        let {skillNames} = this.props

        let skill = skillNames.get(id, Map())
        return `==![skill-${id}](https://static.bnstree.com/images/skills/${skill.get(
            'icon',
            'blank'
        )}) ${skill.get('name')}==`
    }

    render() {
        let {article} = this.props

        let renderedContent = article
            .get('content', '')
            .replace(/\[skill]\((\w+(-\w+)*)\)/g, (match, id) => this.parseSkill(match, id))
            .replace(/\[(\d{5}(-\w+)*)\]/g, (match, id) => this.parseSkill(match, id))

        return (
            <div
                className="editor-preview article"
                dangerouslySetInnerHTML={{__html: md.render(renderedContent)}}
            />
        )
    }
}

export default connect(mapStateToProps)(EditorPreview)
