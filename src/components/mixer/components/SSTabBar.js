import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {tabSelector, currentTabSelector, uiTextSelector} from '../selector'
import {addEquipTab, deleteEquipTab, setTab} from '../actions'

import {Icon, Menu} from 'antd'

const mapStateToProps = (state) => {
    return {
        tabs: tabSelector(state),
        currentTab: currentTabSelector(state),
        uiText: uiTextSelector(state).get('MIXER_TAB_BAR', Map())
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addTab: () => dispatch(addEquipTab()),
        deleteTab: (e, i) => {
            e.stopPropagation()
            e.preventDefault()
            dispatch(deleteEquipTab(i))
        },
        setTab: (i) => dispatch(setTab(i))
    }
}

const TabBar = (props) => {
    let tabs = []
    let oneTab = props.tabs.size <= 1
    props.tabs.forEach((b, i) => {
        let close = oneTab ? null : <Icon type="cross" onClick={(e) => props.deleteTab(e, i)}/>
        tabs.push(
            <Menu.Item key={i}>
                <span className='tab-name'>{props.uiText.get('defaultTab', '') + (i + 1)}</span>
                {close}
            </Menu.Item>
        )
    })

    return (
        <div className='ssTabBar tabBar'>
            <div className='tabContainer'>
                <div className='tabs'>
                    <Menu mode="horizontal" onClick={(e) => props.setTab(e.key)} selectedKeys={[props.currentTab.toString()]}>
                        {tabs}
                    </Menu>
                </div>
                <a onClick={() => props.addTab()} className='functionLink'>
                    <Icon type="plus"/> <span>{props.uiText.get('newTab')}</span>
                </a>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBar)
