import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import Fade from 'react-reveal/Fade'

import ItemSubMenu from './ItemSubMenu'
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
        let itemColumn1 = []
        let itemColumn2 = []
        let i = 0
        group.forEach((item, id) => {
            let component = <ItemListItem item={item} itemId={id} key={id} />
            items.push(component)
            if (i % 2 === 0) {
                itemColumn1.push(component)
            } else {
                itemColumn2.push(component)
            }
            i++
        })
        tabs.push(
            <TabPane tab={t(key)} key={key}>
                <Fade>
                    <div className="item-list-container">
                        <div className="item-list item-list-single">{items}</div>
                        <div className="item-list item-list-column">{itemColumn1}</div>
                        <div className="item-list item-list-column">{itemColumn2}</div>
                    </div>
                </Fade>
            </TabPane>
        )
    })

    return (
        <div className="item-container">
            <ItemSubMenu />
            <Tabs animated>{tabs}</Tabs>
        </div>
    )
}

export default connect(mapStateToProps)(translate('items')(BadgeList))
