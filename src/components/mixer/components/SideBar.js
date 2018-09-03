import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {Dropdown, Menu, Button, Icon} from 'antd'
import {keywordSelector, classSelector, filterSelector, uiTextSelector} from '../selector'
import {setClass, setFilter, setSearchKeyword} from '../actions'

const mapStateToProps = (state) => {
    return {
        keyword: keywordSelector(state),
        uiText: uiTextSelector(state).get('SS_SIDE_BAR', Map()),
        classNames: uiTextSelector(state).get('CLASS_NAMES', Map()),
        currentClass: classSelector(state),
        currentFilter: filterSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setClass: (c) => dispatch(setClass(c.key)),
        setFilter: (filter) => dispatch(setFilter(filter)),
        setKeyword: (e) => dispatch(setSearchKeyword(e.target.value)),
        clear: () => dispatch(setSearchKeyword(''))
    }
}

const filterCodes = [
    'ALL',
    'VT',
    'BT',
    'MSP',
    'WW'
]

const classCodes = [
    'ALL',
    'BM',
    'KF',
    'DE',
    'FM',
    'AS',
    'SU',
    'BD',
    'WL',
    'SF',
    'SH'
]

const SideBar = (props) => {
    let filters = filterCodes.map(f => {
        let active = props.currentFilter === f

        return (
            <a key={f} onClick={() => props.setFilter(active ? 'ALL' : f)} className={`filter ${active ? 'active' : ''}`}>
                {props.uiText.get(f.toLowerCase(), '')}
            </a>
        )
    })

    let classes = classCodes.map(c => <Menu.Item key={c} className={c == props.currentClass ? 'active' : ''}>{props.classNames.get(c, props.uiText.get('all'))}</Menu.Item>)

    let classMenu = <Menu onClick={props.setClass} theme='dark'>
        {classes}
    </Menu>

    return (
        <div className='mixerSideBar'>
            <div className='search'>
                <input placeholder={props.uiText.get('search')} onChange={props.setKeyword} value={props.keyword}/>
                <span onClick={props.clear} className={'clear' + (props.keyword.length > 0
                    ? ' active'
                : '')}>&times;</span>
            </div>
            <div className='classDropdown'>
                <h5>{props.uiText.get('class')}</h5>
                <Dropdown overlay={classMenu} trigger={['click']}>
                    <Button>
                        {props.classNames.get(props.currentClass, props.uiText.get('all', ''))} <Icon type="down" />
                    </Button>
                </Dropdown>
            </div>
            <div className='filterList'>
                <h5>{props.uiText.get('sets')}</h5>
                {filters}
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
