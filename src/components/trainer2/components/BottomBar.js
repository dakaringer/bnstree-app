import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {uiTextSelector, patchDataSelector, patchSelector} from '../selector'
import {setPatch} from '../actions'

import { Button, Menu, Dropdown, Icon } from 'antd'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('BOTTOM_BAR', Map()),
        patches: patchDataSelector(state),
        currentPatch: patchSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPatch: (date) => dispatch(setPatch(date))
    }
}

const BottomBar = (props) => {
    let patches = [
        <Menu.Item key='base'>
            <a onClick={() => props.setPatch('BASE')}>BASE</a>
        </Menu.Item>
    ]
    props.patches.forEach((patch, date) => {
        let d = new Date(date)
        patches.push(
            <Menu.Item key={date}>
                <a onClick={() => props.setPatch(date)}>KR {d.toLocaleDateString()}</a>
            </Menu.Item>
        )
    })

    let menu =
        <Menu>
            {patches.reverse()}
        </Menu>

    let label = props.currentPatch
    if (label != 'BASE') {
        let d = new Date(props.currentPatch)
        label = d.toLocaleDateString()
    }
    return (
        <div className='bottomBar'>
            <Dropdown overlay={menu} placement="topLeft">
                <Button ghost>
                    Patch: {label} <Icon type="up" />
                </Button>
            </Dropdown>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar)
