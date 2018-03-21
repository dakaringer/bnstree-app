import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import classImages from '../images/map_classImg'
import classes from '../../NavBar/linkmap_skills'

import { viewSelector } from '../../../selectors'
import { searchSelector } from '../selectors'
import { setSearch, setFilter } from '../actions'

//import ItemPatchMenu from './ItemPatchMenu'

import { Icon, Radio } from 'antd'
const RadioGroup = Radio.Group

const mapStateToProps = state => {
    return {
        search: searchSelector(state),
        filter: viewSelector(state).get('itemFilter', 'ALL')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSearch: value => dispatch(setSearch(value)),
        setFilter: (value) => dispatch(setFilter(value))
    }
}

const ItemSubMenu = props => {
    const { t, search, filter, setSearch, setFilter } = props

    let clear = search ? (
        <Icon onClick={() => setSearch('')} className="clear" type="close" />
    ) : null

    let filters = []
    classes.forEach(c => {
        filters.push(
            <Radio
                value={c[0]}
                className="class-filter sub-menu-item"
                key={c[0]}>
                <img alt={c[1]} src={classImages[c[0]]} />
            </Radio>
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
                <RadioGroup
                    className="class-filters sub-menu-group"
                    onChange={e => setFilter(e.target.value)}
                    value={filter}>
                    <Radio
                        value="ALL"
                        className="class-filter sub-menu-item"
                        key="ALL">
                        {t('all')}
                    </Radio>
                    {filters}
                </RadioGroup>
            </div>
            <div className="sub-menu-right">
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('items')(ItemSubMenu))
