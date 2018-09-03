import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {uiTextSelector, regionSelector, classSelector, rankingDataSelector, modeSelector} from '../selector'
import {loadRankings} from '../actions'

import {Menu} from 'antd'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('RANKINGS', Map()),
        currentRegion: regionSelector(state),
        currentClass: classSelector(state),
        rankingData: rankingDataSelector(state),
        currentMode: modeSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadRankings: (mode, region, classCode, page) => dispatch(loadRankings(mode, region, classCode, page))
    }
}

const RankingTabBar = (props) => {
    let tabs = [
        <Menu.Item key='solo'>
            <span className='tab-name'>{props.uiText.get('solo')}</span>
        </Menu.Item>,
        <Menu.Item key='tag'>
            <span className='tab-name'>{props.uiText.get('tag')}</span>
        </Menu.Item>
    ]

    return (
        <div className='tabBar rankingTabBar'>
            <div className='tabContainer'>
                <div className='tabs'>
                    <Menu mode="horizontal" onClick={(e) => props.loadRankings(e.key, props.currentRegion, props.currentClass, 1)} selectedKeys={[props.currentMode]}>
                        {tabs}
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(RankingTabBar)
