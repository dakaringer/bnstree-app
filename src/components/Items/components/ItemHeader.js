import React from 'react'
import {translate} from 'react-i18next'
import {NavLink, withRouter} from 'react-router-dom'

import {Icon, Popover} from 'antd'

import items from '../../NavBar/linkmap_items'
import icon from '../images/GameUI_HeaderIcon_207.png'

class ItemHeader extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            popover: false
        }
    }

    handlePopover(type, open) {
        let state = {}
        state[type] = open
        this.setState(state)
    }

    render() {
        const {t, match} = this.props

        let type = match.params.type || 'items'

        let itemLinks = []
        items.forEach(type => {
            itemLinks.push(
                <NavLink
                    to={`/items/${type[1]}`}
                    exact
                    className="item-link"
                    onClick={() => this.handlePopover('popover', false)}
                    key={type[0]}>
                    <p>{t(type[0])}</p>
                </NavLink>
            )
        })

        return (
            <div className="item-header section-header">
                <div className="header-title item-selector">
                    <Popover
                        placement="bottomLeft"
                        visible={this.state.popover}
                        onVisibleChange={visible => this.handlePopover('popover', visible)}
                        content={<div className="item-selector-popover">{itemLinks}</div>}>
                        <span>
                            <img alt="items" src={icon} />
                            <div>
                                {t(type)} <Icon type="down" />
                            </div>
                        </span>
                    </Popover>
                </div>
            </div>
        )
    }
}

export default withRouter(translate('items')(ItemHeader))
