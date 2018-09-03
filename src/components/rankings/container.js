import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import RankingNav from './components/RankingNav'
import RankingTabBar from './components/RankingTabBar'
import RankingList from './components/RankingList'

import {loadingSelector} from '../../selector'
import {uiTextSelector, regionSelector} from './selector'
import {loadRankings} from './actions'

import Loading from '../shared/components/loading/container'

import './styles/rankings.scss'

const mapStateToProps = (state) => {
    return {
        loading: loadingSelector(state),
        uiText: uiTextSelector(state).get('RANKINGS', Map()),
        currentRegion: regionSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadRankings: (mode, region, classCode, page) => dispatch(loadRankings(mode, region, classCode, page))
    }
}

class Rankings extends React.Component {
    componentWillMount() {
        this.props.loadRankings('solo', 'na', 'all', 1)
    }
    componentDidMount() {
        document.title = 'Rankings | BnSTree'
    }
    render() {
        let container = null
        if (this.props.loading) {
            container = <Loading/>
        }
        else {
            container =
                <div className='mainContainer'>
                    <RankingList/>
                </div>
        }

        return (
            <div className='rankings'>
                <RankingNav/>
                <RankingTabBar/>
                {container}
                <div className='bottomBar'><p>{this.props.uiText.get('info')}</p></div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rankings)
