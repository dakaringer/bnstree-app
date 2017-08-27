import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import elementImages from '../images/map_elementImg'

//import {userSelector} from '../../../selector'
import {buildElementSelector, searchSelector, viewSelector, filterSelector} from '../selectors'
import {toggleElement, setSearch, updateView, setFilter} from '../actions'

import SkillSettings from './SkillSettings'
import SkillShareMenu from './SkillShareMenu'

import {Icon, Checkbox, Popover, Radio} from 'antd'
const RadioGroup = Radio.Group

const filterList = [
    'ALL',
    'STUN',
    'DAZE',
    'KNOCKDOWN',
    'RESIST',
    'DEFENSE',
    'ESCAPE',
    'PARTY',
    'CORE'
]

const mapStateToProps = state => {
    return {
        element: buildElementSelector(state),
        search: searchSelector(state),
        visibility: viewSelector(state).get('visibility', 'ALL'),
        currentFilter: filterSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleElement: () => dispatch(toggleElement()),
        setSearch: value => dispatch(setSearch(value)),
        toggleVisibility: e =>
            dispatch(updateView('visibility', e.target.checked ? 'TRAINABLE' : 'ALL')),
        setFilter: filter => dispatch(setFilter(filter))
    }
}

const SkillSubMenu = props => {
    const {
        t,
        element,
        toggleElement,
        search,
        setSearch,
        visibility,
        currentFilter,
        toggleVisibility,
        setFilter
    } = props

    let clear = search
        ? <Icon onClick={() => setSearch('')} className="clear" type="close" />
        : null

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        color: 'white'
    }
    let filters = []
    filterList.forEach(f => {
        filters.push(
            <Radio style={radioStyle} value={f} key={f}>
                {t(f)}
            </Radio>
        )
    })
    let filter = (
        <RadioGroup onChange={e => setFilter(e.target.value)} value={currentFilter}>
            {filters}
        </RadioGroup>
    )

    return (
        <div className="skill-option-bar sub-menu">
            <div className="sub-menu-left">
                <div className="elementToggle sub-menu-item">
                    <a onClick={() => toggleElement()}>
                        <img alt={element} src={elementImages[element]} />
                        <span>
                            {element ? t(`general:${element}`) : ''}{' '}
                            <small>
                                <Icon type="swap" />
                            </small>
                        </span>
                    </a>
                </div>
                <div className="searchGroup sub-menu-group">
                    <div className="skillSearch sub-menu-item">
                        <input
                            placeholder={t('search')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {clear}
                    </div>
                    <div className="filter sub-menu-item">
                        <Popover content={filter} trigger="click" placement="bottomLeft">
                            <a className={currentFilter !== 'ALL' ? 'active' : ''}>
                                <Icon type="filter" /> {t('filter')}
                            </a>
                        </Popover>
                    </div>
                </div>
                <div className="skillVisibility sub-menu-item">
                    <Checkbox
                        defaultChecked={false}
                        size="small"
                        onChange={toggleVisibility}
                        checked={visibility === 'TRAINABLE'}>
                        {t('showTrainable')}
                    </Checkbox>
                </div>
            </div>
            <div className="sub-menu-right">
                <SkillSettings />
                <SkillShareMenu />
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['skills', 'general'])(SkillSubMenu)
)
