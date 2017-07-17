import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {
    elementDataSelector,
    filterSelector
} from '../selectors'
import {setFilter} from '../actions'

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

const mapStateToProps = (state) => {
    return {
        elementData: elementDataSelector(state),
        currentFilter: filterSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setFilter: (filter) => dispatch(setFilter(filter))
    }
}

const SkillInfo = (props) => {
    const {t, elementData, currentFilter, setFilter} = props

    let filters = []
    filterList.forEach(f => {
        let active = currentFilter === f
        filters.push(
            <a 
                key={f} 
                onClick={() => setFilter(active ? 'ALL' : f)} 
                className={`filter ${f.toLowerCase()} ${active ? 'active' : ''}`}
            >
                {t(f)}
            </a>
        )
    })

    return (
        <div className='skill-info side-bar'>
            <div className='filters'>
                {filters}
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('skills')(SkillInfo))
