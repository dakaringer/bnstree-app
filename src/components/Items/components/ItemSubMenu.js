import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'
import {translate} from 'react-i18next'

import classImages from '../images/map_classImg'
import classes from '../../NavBar/linkmap_skills'

import {viewSelector} from '../../../selectors'
import {searchSelector} from '../selectors'
import {setSearch, setFilter} from '../actions'

import ItemPatchMenu from './ItemPatchMenu'

import {Icon, Checkbox} from 'antd'

const mapStateToProps = state => {
    return {
        search: searchSelector(state),
        filter: viewSelector(state).get('itemFilter', Map())
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSearch: value => dispatch(setSearch(value)),
        setFilter: (classCode, value) => dispatch(setFilter(classCode, value))
    }
}

const ItemSubMenu = props => {
    const {t, search, filter, setSearch, setFilter} = props

    let clear = search ? (
        <Icon onClick={() => setSearch('')} className="clear" type="close" />
    ) : null

    let filters = []
    classes.forEach(c => {
        filters.push(
            <span className="class-filter sub-menu-item" key={c[0]}>
                <Checkbox
                    checked={filter.get(c[0], false)}
                    onChange={e => setFilter(c[0], e.target.checked)}>
                    <img alt={c[1]} src={classImages[c[0]]} />
                </Checkbox>
            </span>
        )
    })

    return (
        <div className="item-filters sub-menu">
            <div className="sub-menu-left">
                <div className="searchGroup sub-menu-group">
                    <div className="search sub-menu-item">
                        <input
                            placeholder={t('search')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {clear}
                    </div>
                </div>
                <div className="class-filters sub-menu-group">{filters}</div>
            </div>
            <div className="sub-menu-right">
                <ItemPatchMenu />
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('items')(ItemSubMenu))
