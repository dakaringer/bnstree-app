import React from 'react'
import {connect} from 'react-redux'
import {Map, List, fromJS} from 'immutable'

import {Checkbox, Tooltip} from 'antd'
import {stringParser} from '../parser'
import {
    keywordSelector,
    visibilitySelector,
    filterSelector,
    uiTextSelector,
    classElementSelector,
    currentElementSelector,
    constantSelector,
    modeSelector,
    orderSelector
} from '../selector'
import {
    viewModes,
    setViewMode,
    visibility,
    setSearchKeyword,
    toggleVisibility,
    toggleCurrentElement,
    setFilter,
    setOrderMode
} from '../actions'

import typeImages from '../images/map_typeImg'

const mapStateToProps = (state) => {
    return {
        keyword: keywordSelector(state),
        visibility: visibilitySelector(state),
        uiText: uiTextSelector(state).get('SKILL_SIDE_BAR', Map()),
        classElements: classElementSelector(state),
        currentElement: currentElementSelector(state),
        constants: constantSelector(state),
        currentFilter: filterSelector(state),
        mode: modeSelector(state),
        order: orderSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setKeyword: (e) => dispatch(setSearchKeyword(e.target.value)),
        clear: () => dispatch(setSearchKeyword('')),
        toggleVisibility: (mode) => dispatch(toggleVisibility(mode)),
        toggleElement: () => dispatch(toggleCurrentElement()),
        setFilter: (filter) => dispatch(setFilter(filter)),
        setMode: (mode) => dispatch(setViewMode(mode)),
        setOrderMode: (order) => dispatch(setOrderMode(order))
    }
}

const SideBar = (props) => {
    let otherElement = props
        .classElements
        .getIn([0, 'element']) === props.currentElement
        ? props
            .classElements
            .getIn([1, 'element'])
        : props
            .classElements
            .getIn([0, 'element'])
    let additionalFilters = props
        .classElements
        .find(a => a.get('element') === props.currentElement, null, Map())
        .get('additionalFilters', List())
    let filterList = List([
        'ALL',
        'STUN',
        'DAZE',
        'KNOCKDOWN',
        'RESIST',
        'DEFENSE',
        'ESCAPE',
        'PARTY',
        'CORE'
    ]).concat(additionalFilters)
    let filters = []

    filterList.forEach((a) => {
        let filter = props
            .constants
            .getIn([
                'FILTERS', a
            ], Map())

        let active = props.currentFilter === a

        let img = null
        let icon = filter.get('icon')
        if (a != 'ALL' && icon) {
            if (typeImages[filter.get('icon')]) {
                img = <img className='filterImg' src={typeImages[icon]}/>
            } else {
                img = <img className='filterImg' src={`/images/skill/${icon}.png`}/>
            }
        }

        if (filter.get('desc')) {
            let tooltip = <span>{filter.get('desc')}</span>
            filters.push(
                <Tooltip key={a} placement="right" overlay={tooltip}>
                    <a
                        onClick={() => props.setFilter(active
                        ? 'ALL'
                        : a)}
                        className={`filter ${active
                        ? 'active'
                        : ''}`}>
                        {img}
                        <span>{filter.get('text')}</span>
                    </a>
                </Tooltip>
            )
        } else {
            filters.push(
                <a
                    key={a}
                    onClick={() => props.setFilter(active
                    ? 'ALL'
                    : a)}
                    className={`filter ${active
                    ? 'active'
                    : ''}`}>
                    {img}
                    <span>{filter.get('text')}</span>
                </a>
            )
        }
    })

    let sort = null
    if (props.mode == 'SHOW_LIST') {
        sort = <div className='sortList'>
            <h5>{props.uiText.get('sort')}</h5>
            <a
                onClick={() => props.setOrderMode('LEVEL')}
                className={`order ${props.order == 'LEVEL' ? 'active' : ''}`}>
                {props.uiText.get('level')}
            </a>
            <a
                onClick={() => props.setOrderMode('HOTKEY')}
                className={`order ${props.order == 'HOTKEY' ? 'active' : ''}`}>
                {props.uiText.get('hotkey')}
            </a>
        </div>
    }

    let views = <div className='modeList'>
            <h5>{props.uiText.get('view')}</h5>
            <a
                onClick={() => props.setMode(viewModes.SHOW_LIST)}
                className={`mode ${props.mode == viewModes.SHOW_LIST ? 'active' : ''}`}>
                {props.uiText.get('modeList')}
            </a>
            <a
                onClick={() => props.setMode(viewModes.SHOW_GRID)}
                className={`mode ${props.mode == viewModes.SHOW_GRID ? 'active' : ''}`}>
                {props.uiText.get('modeGrid')}
            </a>
        </div>


    return (
        <div className='sideBar'>
            <div className={`currentElement ${props.currentElement}`}>
                <h2>{props.constants.getIn(['ELEMENT', props.currentElement], '')}</h2>
            </div>
            <a className='elementSwitch' onClick={() => props.toggleElement()}>
                {stringParser(fromJS({
                    template: 'changeElement',
                    variables: {
                        element: otherElement
                    }
                }), props.uiText, props.constants)}
            </a>
            <div className='visibilityFilter'>
                <Checkbox
                    defaultChecked={false}
                    size="small"
                    onChange={props.toggleVisibility}
                    checked={props.visibility === visibility.SHOW_TRAINABLE}>
                    {props.uiText.get('trainable', '')}
                </Checkbox>
            </div>
            <div className='search'>
                <input
                    onChange={props.setKeyword}
                    placeholder={props.uiText.get('search')}
                    value={props.keyword}/>
                <span 
                    onClick={props.clear}
                    className={'clear' + (props.keyword.length > 0? ' active' : '')}>&times;</span>
            </div>
            <div className='filterList'>
                <h5>{props.uiText.get('filters')}</h5>
                {filters}
            </div>
            {views}
            {sort}
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
