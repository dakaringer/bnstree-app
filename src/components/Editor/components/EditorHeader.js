import React from 'react'

import icon from '../images/GameUI_HeaderIcon_230.png'

const EditorHeader = props => {
    return (
        <div className="editor-header section-header">
            <div className="header-title">
                <img alt="editor" src={icon} />
                <span>Editor</span>
            </div>
        </div>
    )
}

export default EditorHeader
