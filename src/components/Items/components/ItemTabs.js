import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Fade} from 'react-reveal'

import ItemFilter from './ItemFilter'
import ItemListItem from './ItemListItem'

import {sortedItemDataSelector} from '../selectors'

import {Tabs} from 'antd'
const TabPane = Tabs.TabPane

const mapStateToProps = state => {
    return {
        data: sortedItemDataSelector(state)
    }
}

const BadgeList = props => {
    const {t, data} = props

    let tabs = []
    data.forEach((group, key) => {
        let items = []
        group.forEach((item, id) => items.push(<ItemListItem item={item} itemId={id} key={id} />))
        tabs.push(
            <TabPane tab={t(key)} key={key} className="item-list">
                {items}
            </TabPane>
        )
    })

    return (
        <Fade className="item-list-container">
            <ItemFilter />
            <Tabs animated>{tabs}</Tabs>
        </Fade>
    )
}

export default connect(mapStateToProps)(translate('items')(BadgeList))
