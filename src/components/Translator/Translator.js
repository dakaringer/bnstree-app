import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'antd'

import './styles/Translator.scss'

import TranslatorHeader from './components/TranslatorHeader'
import TranslatorStatusBar from './components/TranslatorStatusBar'
import TranslatorSelector from './components/TranslatorSelector'
import TranslatorEditor from './components/TranslatorEditor'

import { loadLanguageData } from './actions'

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
        return (
            <div className="translator">
                <div className="container">
                    <TranslatorHeader />
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
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(Translator)
