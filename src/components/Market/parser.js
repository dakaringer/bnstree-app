import React from 'react'
import {List} from 'immutable'
import {Icon} from 'antd'

import currencyImages from './images/map_currencyImg'

const currency = ['gold', 'silver', 'copper']

export function parsePrice(itemData) {
    let priceData = itemData.get('priceData', List())

    let dayPrices = priceData.getIn([0, 'items'], List())
    let offset = 1
    let latestFound = false
    let latest = List()
    while (!latestFound) {
        latest = dayPrices.get(dayPrices.size - offset, List())
        if (latest.get(1) !== 0 || dayPrices.size - offset === 0) {
            latestFound = true
        }
        offset++
    }

    let monthPrices = priceData.getIn([priceData.size - 1, 'items'], List())
    offset = 1
    latestFound = false
    let previous = List()
    while (!latestFound) {
        previous = monthPrices.get(monthPrices.size - offset, List())
        if (previous.get(1) !== 0 || monthPrices.size - offset === 0) {
            latestFound = true
        }
        offset++
    }

    let delta = latest.get(1) - previous.get(1)

    let price = []
    let diff = []
    let diffPrice = parseCurrency(delta)
    let itemPrice = parseCurrency(latest.get(1))
    currency.forEach((c, i) => {
        let p = itemPrice[i]
        let d = diffPrice[i]

        if (p > 0) {
            price.push(
                <span key={c} className={c}>
                    {p} <img alt={c} src={currencyImages[c]} />
                </span>
            )
        }
        if (d > 0) {
            diff.push(
                <span key={c} className={c}>
                    {d} <img alt={c} src={currencyImages[c]} />
                </span>
            )
        }
    })

    let percentDiff = delta / (latest.get(1) === 0 ? delta : latest.get(1)) * 100
    percentDiff = isNaN(percentDiff) ? 0 : percentDiff
    let icon = <Icon type="minus" />
    if (delta > 0) icon = <Icon type="caret-up" />
    if (delta < 0) icon = <Icon type="caret-down" />

    return (
        <div className="item-price">
            <div className="price">{price}</div>
            <div className={`price-diff ${delta > 0 ? 'up' : ''} ${delta < 0 ? 'down' : ''}`}>
                <div className="price delta">
                    {icon} {diff}
                </div>
                <div className="percent-delta">({percentDiff.toFixed(2)}%)</div>
            </div>
        </div>
    )
}

export function parseCurrency(price) {
    price = Math.abs(price)
    let copper = price % 100
    let silver = Math.floor(price / 100) % 100
    let gold = Math.floor(price / 10000)
    return [gold, silver, copper]
}
