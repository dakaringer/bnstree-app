import React from 'react'
import {connect} from 'react-redux'
import {Row, Col} from 'antd'
import {Helmet} from 'react-helmet'

import './styles/Translator.scss'

import LoadingLyn from '../LoadingLyn/LoadingLyn'
import TranslatorHeader from './components/TranslatorHeader'
import TranslatorStatusBar from './components/TranslatorStatusBar'
import TranslatorSelector from './components/TranslatorSelector'
import TranslatorEditor from './components/TranslatorEditor'

import {loadingSelector} from '../../selectors'
import {loadLanguageData} from './actions'

const mapStateToProps = state => {
    return {
        loading: loadingSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadLanguageData: () => dispatch(loadLanguageData())
    }
}

class Translator extends React.PureComponent {
    componentWillMount() {
        this.props.loadLanguageData()
    }

    render() {
        const {loading} = this.props
        let content = <LoadingLyn />
        if (!loading) {
            content = (
                <div>
                    <TranslatorStatusBar />
                    <Row gutter={16}>
                        <Col sm={4}>
                            <TranslatorSelector />
                        </Col>
                        <Col sm={6}>
                            <TranslatorSelector groupMode={true} />
                        </Col>
                        <Col sm={14}>
                            <TranslatorEditor />
                        </Col>
                    </Row>
                </div>
            )
        }

        return (
            <div className="translator">
                <Helmet>
                    <title>Translator Console | BnSTree</title>
                </Helmet>
                <div className="container">
                    <TranslatorHeader />
                    {content}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Translator)
