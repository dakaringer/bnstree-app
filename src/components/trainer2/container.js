import React from 'react'

import TrainerNav from './components/TrainerNav'
import SkillTabBar from './components/SkillTabBar'
import SideBar from './components/SideBar'
import SkillList from './components/SkillList'
import SkillGrid from './components/SkillGrid'
import BottomBar from './components/BottomBar'
import BuildCatalog from './components/BuildCatalog'

import {Row, Col} from 'antd'

import {connect} from 'react-redux'
import {modeSelector} from './selector'
import {currentLanguageSelector, loadingSelector} from '../../selector'

import {loadClass, loadTextData} from './actions'

import ClassLinks from '../shared/components/classLinks/container2'
import Loading from '../shared/components/loading/container'

import './styles/trainer.scss'

const mapStateToProps = (state) => {
    return {
        currentLanguage: currentLanguageSelector(state),
        mode: modeSelector(state),
        loading: loadingSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadText: (lang) => dispatch(loadTextData(lang)),
        loadClass: (classCode, buildCode, buildLink) => dispatch(loadClass(classCode, buildCode, buildLink))
    }
}

class Trainer extends React.Component {
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
        let container = null
        if (this.props.loading) {
            container = <Loading/>
        }
        else if (this.props.mode == 'SHOW_LIST') {
            container = <Row>
                <Col sm={4} className='sideBarContainer'>
                    <SideBar/>
                </Col>
                <Col sm={20} className='mainContainer'>
                    <SkillList/>
                </Col>
            </Row>
        }
        else {
            container = <Row>
                <Col sm={4} className='sideBarContainer'>
                    <SideBar/>
                </Col>
                <Col sm={20} className='mainContainer'>
                    <SkillGrid/>
                </Col>
            </Row>
        }

        return (
            <div className='trainer2'>
                <TrainerNav/>
                <SkillTabBar/>
                {container}
                <BottomBar/>
                <ClassLinks/>
                <BuildCatalog/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Trainer)
