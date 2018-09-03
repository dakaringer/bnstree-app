import React from 'react'

import MixerNav from './components/MixerNav'
import SSTabBar from './components/SSTabBar'
import SideBar from './components/SideBar'
import SSList from './components/SSList'
import SSEquip from './components/SSEquip'

import {Row, Col} from 'antd'

import {connect} from 'react-redux'
import {currentLanguageSelector, loadingSelector} from '../../selector'

import {loadTextData, loadSS} from './actions'

import Loading from '../shared/components/loading/container'

import './styles/mixer.scss'

const mapStateToProps = (state) => {
    return {
        currentLanguage: currentLanguageSelector(state),
        loading: loadingSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadText: (lang) => dispatch(loadTextData(lang)),
        loadData: (lang, build) => dispatch(loadSS(lang, build))
    }
}

class Mixer extends React.PureComponent {
    componentWillMount() {
        let params = new URLSearchParams(this.props.location.search)
        let build = params.get('b')

        this.props.loadText(this.props.currentLanguage)
        this.props.loadData(this.props.currentLanguage, build)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.currentLanguage != this.props.currentLanguage) {
            this.props.loadText(nextProps.currentLanguage)
            this.props.loadData(nextProps.currentLanguage)
        }
    }
    componentDidMount() {
        document.title = 'Soul Shield | BnSTree'
    }
    render() {
        let container = null
        if (this.props.loading) {
            container = <Loading/>
        }
        else {
            container =
                <Row>
                    <Col sm={4} className='sideBarContainer'>
                        <SideBar/>
                    </Col>
                    <Col sm={20} className='mainContainer'>
                        <Row>
                            <SSEquip/>
                            <SSList/>
                        </Row>
                    </Col>
                </Row>
        }

        return (
            <div className='mixer'>
                <MixerNav/>
                <SSTabBar/>
                {container}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Mixer)
