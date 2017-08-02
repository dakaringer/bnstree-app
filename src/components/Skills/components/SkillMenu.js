import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {elementDataSelector, filterSelector} from '../selectors'
import {setFilter} from '../actions'

const mapStateToProps = state => {
    return {
        elementData: elementDataSelector(state),
        currentFilter: filterSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setFilter: filter => dispatch(setFilter(filter))
    }
}

const SkillMenu = props => {
    const {t, currentFilter, setFilter} = props

    return <div className="skill-menu side-bar" />
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('skills')(SkillMenu))
