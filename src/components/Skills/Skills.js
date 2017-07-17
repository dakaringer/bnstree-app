import React from 'react'
import {connect} from 'react-redux'

import {Row, Col} from 'antd'

import {currentLanguageSelector, loadingSelector} from '../../selectors'
import {viewSelector} from './selectors'
import {loadTextData, loadClass} from './actions'

import './styles/Skills.scss'

import {classes} from '../NavBar/NavBar'
import LoadingLyn from '../LoadingLyn/LoadingLyn'
import Header from './components/SkillHeader'
import SubHeader from './components/SkillSubHeader'
import SkillInfo from './components/SkillInfo'
import SkillList from './components/SkillList'

function getClassCode(link) {
    let classCode = 'BM'
    classes.forEach(c => {
        if (c[1] === link) {
            classCode = c[0]
        }
    })
    return classCode
}

const mapStateToProps = (state) => {
    return {
        currentLanguage: currentLanguageSelector(state),
        view: viewSelector(state),
        loading: loadingSelector(state)
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
        const {location, match, currentLanguage, loadText, loadClass} = this.props

        let params = new URLSearchParams(location.search)
        let classCode = getClassCode(match.params.classCode)
        loadText(currentLanguage)
        loadClass(classCode, params.get('b'), match.params.buildLink)
    }
    componentWillReceiveProps(nextProps) {
        const {match, currentLanguage, loadText, loadClass} = this.props

        let classCode = getClassCode(nextProps.match.params.classCode)
        if (nextProps.currentLanguage !== currentLanguage) {
            loadText(nextProps.currentLanguage)
        }
        if (classCode !== getClassCode(match.params.classCode) || nextProps.match.params.buildLink !== match.params.buildLink) {
            loadClass(classCode, null, nextProps.match.params.buildLink)
        }
    }
    componentDidMount() {
        document.title = 'Skills | BnSTree'
    }

    render() {
        const {loading} = this.props

        let content = <div>
            <Header/>
            <SubHeader/>
            <Row className='skills-content'>
                <Col sm={4} className='info-container'>
                    <SkillInfo/>
                </Col>
                <Col sm={20} className='main-container'>
                    <SkillList/>
                </Col>
            </Row>
        </div>
        if (loading) {
            content = <LoadingLyn/>
        }

        return (
            <div className='skills'>
                {content}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Skills)
