import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {uiTextSelector, tabSelector} from '../selector'
import {setTab} from '../actions'

import {Menu} from 'antd'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('CHARACTER_NAV', Map()),
        currentTab: tabSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setTab: (tab) => dispatch(setTab(tab))
    }
}

const CharacterTabBar = (props) => {
    let tabs = [
        <Menu.Item key='profile'>
            <span className='tab-name'>{props.uiText.get('profile')}</span>
        </Menu.Item>,
        <Menu.Item key='skills'>
            <span className='tab-name'>{props.uiText.get('skills')}</span>
        </Menu.Item>
    ]

    return (
        <div className='tabBar characterTabBar'>
            <div className='tabContainer'>
                <div className='tabs'>
                    <Menu mode="horizontal" onClick={(e) => props.setTab(e.key)} selectedKeys={[props.currentTab]}>
                        {tabs}
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterTabBar)
