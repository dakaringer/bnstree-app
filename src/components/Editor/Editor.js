import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync'
import { animateScroll } from 'react-scroll'

import './styles/Editor.scss'

import Header from './components/EditorHeader'
import EditorStatusBar from './components/EditorStatusBar'
import EditorTextArea from './components/EditorTextArea'
import Preview from './components/Article'

import { loadNameData } from '../References/actions'
import { loadArticle } from './actions'
import { articleSelector } from './selectors'

const mapStateToProps = state => {
    return {
        article: articleSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadNames: lang => dispatch(loadNameData(lang)),
        loadArticle: id => dispatch(loadArticle(id, true))
    }
}

class Editor extends React.PureComponent {
    componentDidMount() {
        const { loadNames, loadArticle, match } = this.props

        loadNames('en')
        loadArticle(match.params.id)
        animateScroll.scrollToTop()
    }

    render() {
        let { article, history } = this.props

        return (
            <div className="editor container">
                <Helmet>
                    <title>Editor | BnSTree</title>
                </Helmet>
                <Header />
                <div className="main-container">
                    <EditorStatusBar history={history} />
                    <ScrollSync>
                        <div className="editor-main">
                            <ScrollSyncPane>
                                <EditorTextArea article={article} />
                            </ScrollSyncPane>

                            <ScrollSyncPane>
                                <Preview article={article} />
                            </ScrollSyncPane>
                        </div>
                    </ScrollSync>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
