import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map, List} from 'immutable'

import {userSelector} from '../../../selectors'
import {
    dataSelector,
    termSelector,
    graphSelector,
    regionSelector,
    indicatorSelector,
    updateSelector,
    loadingSelector
} from '../selectors'
import {setTerm, setGraph, loadItem, loadBookmarks, setIndicator} from '../actions'

import LoadingLyn from '../../LoadingLyn/LoadingLyn'
import MarketChart from './MarketChart'
import MarketPopularItemList from './MarketPopularItemList'

import {parsePrice} from '../parser'

import {Radio, Icon, Popover, Checkbox} from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

const mapStateToProps = state => {
    return {
        user: userSelector(state),
        loading: loadingSelector(state),
        itemData: dataSelector(state),
        term: termSelector(state),
        graph: graphSelector(state),
        region: regionSelector(state),
        indicators: indicatorSelector(state),
        lastUpdate: updateSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateBookmarks: () => dispatch(loadBookmarks()),
        setTerm: value => dispatch(setTerm(value)),
        setGraph: value => dispatch(setGraph(value)),
        loadItem: (id, replace) => dispatch(loadItem(id, replace)),
        setIndicator: (value, type) => dispatch(setIndicator(value, type))
    }
}

class MarketItemViewer extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            bookmarked: false
        }
    }

    componentWillReceiveProps(nextProps) {
        let {itemData, loadItem} = this.props

        if (
            nextProps.itemData.get('item') &&
            itemData.getIn(['item', '_id']) !== nextProps.itemData.getIn(['item', '_id'])
        ) {
            clearInterval(this.state.intervalId)
            if (nextProps.itemData.get('item')) {
                let intervalId = setInterval(
                    () => loadItem(nextProps.itemData.getIn(['item', '_id']), true),
                    300000
                )

                this.setState({
                    intervalId: intervalId,
                    bookmarked: nextProps.itemData.get('userBookmarked', false)
                })
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId)
    }

    bookmark(bookmarked) {
        let {itemData, updateBookmarks} = this.props

        if (!bookmarked) {
            this.setState({
                bookmarked: true
            })
        }

        fetch('https://api.bnstree.com/market/bookmark', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({
                item: itemData.getIn(['item', '_id'])
            })
        })
            .then(response => response.json())
            .then(json => updateBookmarks())
            .catch(e => console.error(e))
    }

    unbookmark(bookmarked) {
        let {itemData, updateBookmarks} = this.props

        if (bookmarked) {
            this.setState({
                bookmarked: false
            })
        }

        fetch('https://api.bnstree.com/market/bookmark', {
            method: 'delete',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({
                item: itemData.getIn(['item', '_id'])
            })
        })
            .then(response => response.json())
            .then(json => updateBookmarks())
            .catch(e => console.error(e))
    }

    render() {
        const {
            t,
            user,
            itemData,
            lastUpdate,
            term,
            graph,
            indicators,
            region,
            loading,
            setTerm,
            setGraph,
            setIndicator
        } = this.props
        const {bookmarked} = this.state

        let bookmarkButton = user ? (
            bookmarked ? (
                <Icon type="star" />
            ) : (
                <Icon type="star-o" />
            )
        ) : (
            <Icon type="star-o" />
        )

        let bookmark = (
            <a
                className={`bookmark ${!user ? 'disabled' : ''} ${bookmarked ? 'bookmarked' : ''}`}
                onClick={
                    bookmarked ? () => this.unbookmark(bookmarked) : () => this.bookmark(bookmarked)
                }>
                {bookmarkButton}
                {bookmarked ? t('bookmarked') : t('bookmark')}
            </a>
        )

        let content = <LoadingLyn />
        if (!loading) {
            if (itemData.equals(Map())) {
                content = (
                    <div className="market-popular-items">
                        <h3>Popular Items</h3>
                        <MarketPopularItemList />
                    </div>
                )
            } else if (itemData.get('item')) {
                let indicatorCheckboxes = (
                    <div className="graph-indicators">
                        <Checkbox
                            checked={indicators.get('sma', false)}
                            onChange={e => setIndicator(e.target.checked, 'sma')}>
                            {t('indicatorSMA')}
                        </Checkbox>
                        <Checkbox
                            checked={indicators.get('bb', false)}
                            onChange={e => setIndicator(e.target.checked, 'bb')}>
                            {t('indicatorBB')}
                        </Checkbox>
                        <Checkbox
                            checked={indicators.get('sto', false)}
                            onChange={e => setIndicator(e.target.checked, 'sto')}>
                            {t('indicatorSTO')}
                        </Checkbox>
                    </div>
                )

                content = (
                    <div className="market-item">
                        <div className="item-header">
                            <img
                                alt={itemData.getIn(['item', 'name'])}
                                src={itemData.getIn(['item', 'icon'])}
                            />
                            <h3 className={`grade_${itemData.getIn(['item', 'grade'])}`}>
                                {itemData.getIn(['item', 'name'])}
                                <small>{bookmark}</small>
                            </h3>
                        </div>
                        {parsePrice(itemData)}
                        <div className="item-chart">
                            <div>
                                <RadioGroup
                                    className="term-selector"
                                    size="small"
                                    value={term}
                                    onChange={e => setTerm(e.target.value)}>
                                    <RadioButton value={0}>1D</RadioButton>
                                    <RadioButton value={1}>1W</RadioButton>
                                    <RadioButton value={2}>1M</RadioButton>
                                </RadioGroup>
                                <RadioGroup
                                    className="graph-selector"
                                    size="small"
                                    value={graph}
                                    onChange={e => setGraph(e.target.value)}>
                                    <RadioButton value="candlestick">
                                        <Icon type="bar-chart" />
                                    </RadioButton>
                                    <RadioButton value="area">
                                        <Icon type="area-chart" />
                                    </RadioButton>
                                </RadioGroup>
                                <Popover
                                    content={indicatorCheckboxes}
                                    trigger="click"
                                    placement="bottomLeft">
                                    <a className="indicator-button">{t('indicators')}</a>
                                </Popover>
                                <div className="last-update">
                                    {t('lastUpdate')} {lastUpdate.toTimeString()}
                                </div>
                            </div>
                            <MarketChart
                                priceData={itemData.getIn(['priceData', term, 'items'], List())}
                                type={graph}
                                region={region}
                                indicators={indicators}
                            />
                        </div>
                    </div>
                )
            } else {
                content = (
                    <div className="item-not-found">
                        <p>{t('noItem')}</p>
                    </div>
                )
            }
        }

        return <div className="market-item-viewer">{content}</div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['market', 'general'])(MarketItemViewer)
)
