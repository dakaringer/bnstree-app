import React from 'react'
import {connect} from 'react-redux'
import {Fade} from 'react-reveal'
import {ScrollSync, ScrollSyncPane} from 'react-scroll-sync'
import {animateScroll} from 'react-scroll'

import './styles/Editor.scss'

import Header from './components/EditorHeader'
import EditorStatusBar from './components/EditorStatusBar'
import EditorTextArea from './components/EditorTextArea'
import Preview from './components/Article'

import {loadTextData} from '../Skills/actions'
import {loadArticle} from './actions'
import {articleSelector} from './selectors'

const mapStateToProps = state => {
    return {
        article: articleSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadText: lang => dispatch(loadTextData(lang)),
        loadArticle: id => dispatch(loadArticle(id, true))
    }
}

class Editor extends React.PureComponent {
    componentWillMount() {
        const {loadText, loadArticle, match} = this.props

        loadText('en')
        loadArticle(match.params.id)
    }

    componentDidMount() {
        animateScroll.scrollToTop()
    }

    render() {
        return (
            <Fade className="editor container">
                <Header />
                <div className="main-container">
                    <EditorStatusBar />
                    <ScrollSync>
                        <div className="editor-main">
                            <ScrollSyncPane>
                                <EditorTextArea article={this.props.article} />
                            </ScrollSyncPane>

                            <ScrollSyncPane>
                                <Preview article={this.props.article} />
                            </ScrollSyncPane>
                        </div>
                    </ScrollSync>
                </div>
            </Fade>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
