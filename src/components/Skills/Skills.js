import React from 'react'
import {Row, Col} from 'antd'

import {connect} from 'react-redux'
import {currentLanguageSelector} from '../../selectors'

import './styles/Skills.scss'

const mapStateToProps = (state) => {
    return {
        currentLanguage: currentLanguageSelector(state),
        mode: modeSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadText: (lang) => dispatch(loadTextData(lang)),
        loadClass: (classCode, buildCode, buildLink) => dispatch(loadClass(classCode, buildCode, buildLink))
    }
}

class Skills extends React.Component {
    componentWillMount() {
        let params = new URLSearchParams(this.props.location.search)
        this.props.loadText(this.props.currentLanguage)
        this.props.loadClass(this.props.match.params.classCode, params.get('b'), this.props.match.params.buildLink)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.currentLanguage != this.props.currentLanguage) {
            this.props.loadText(nextProps.currentLanguage)
        }
        if (nextProps.match.params.classCode != this.props.match.params.classCode || nextProps.match.params.buildLink != this.props.match.params.buildLink) {
            this.props.loadClass(nextProps.match.params.classCode, null, nextProps.match.params.buildLink)
        }
    }
    componentDidMount() {
        document.title = 'Skills | BnSTree'
    }

    render() {
        return (
            <div className='skills'>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Skills)
