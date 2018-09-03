import React from 'react'

import TrainerNav from './components/TrainerNav'
import TabBar from './components/TabBar'
import SkillList from './components/SkillList'
import SkillGrid from './components/SkillGrid'
import SkillTree from './components/SkillTree'
import TreeTagList from './components/TreeTagList'
import SkillTooltip from './components/SkillTooltip'
//import BottomBar from './components/BottomBar'
import BuildList from './components/BuildList'

import {Row, Col} from 'antd'

import {connect} from 'react-redux'
import {modeSelector, loadingSelector} from './selector'
import {currentLanguageSelector} from '../../selector'

import {loadClass, loadTextData, loadBuildList} from './actions'

import ClassLinks from '../shared/components/classLinks/container'
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
        loadClass: (job, build) => dispatch(loadClass(job, build)),
        loadBuildList: (job, page) => dispatch(loadBuildList(job, page))
    }
}

class Trainer extends React.Component {
    componentWillMount() {
        let params = new URLSearchParams(this.props.location.search)
        let build = params.get('build') || params.get('b')

        this.props.loadText(this.props.currentLanguage)
        this.props.loadClass(this.props.match.params.classCode, build)
        this.props.loadBuildList(this.props.match.params.classCode, 1)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.currentLanguage != this.props.currentLanguage) {
            this.props.loadText(nextProps.currentLanguage)
        }
        if (nextProps.match.params.classCode != this.props.match.params.classCode) {
            this.props.loadClass(nextProps.match.params.classCode)
            this.props.loadBuildList(nextProps.match.params.classCode, 1)
        }
    }
    render() {
        let container = null
        if (this.props.loading) {
            container = <Loading/>
        }
        else if (this.props.mode == 'SHOW_LIST') {
            container =
                <Row>
                    <Col lg={6} className='skillListContainer'>
                        <SkillList/>
                    </Col>
                    <Col lg={18} className='tooltipTreeContainer'>
                        <Row>
                            <Col xs={12} className='treeContainer'>
                                <SkillTree/>
                                <TreeTagList/>
                            </Col>
                            <Col xs={12} className='tooltipContainer'>
                                <SkillTooltip/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
        }
        else {
            container =
                <div className='row'>
                    <SkillGrid/>
                </div>
        }

        return (
            <div className='trainer'>
                <TrainerNav/>
                <TabBar/>
                <div>
                    {container}
                </div>
                <ClassLinks/>
                <BuildList/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Trainer)
