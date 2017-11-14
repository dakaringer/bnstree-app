import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import Sortable from 'react-sortablejs'
import {Link} from 'react-router-dom'

import {userSelector, viewSelector} from '../../../selectors'
import {bookmarksSelector} from '../selectors'
import {loadBookmarks, updateBookmarkOrder} from '../actions'

import {parsePrice} from '../parser'

const mapStateToProps = state => {
    return {
        user: userSelector(state),
        bookmarks: bookmarksSelector(state),
        region: viewSelector(state).get('marketRegion', 'na')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadBookmarks: () => dispatch(loadBookmarks())
    }
}

class MarketBookmarkList extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            order: []
        }
    }

    componentDidMount() {
        this.props.loadBookmarks()
        let intervalId = setInterval(() => this.props.loadBookmarks(), 300000)
        this.setState({
            intervalId: intervalId
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId)
    }

    reorder(order) {
        this.setState({
            order: order
        })
        updateBookmarkOrder(order)
    }

    render() {
        const {t, user, bookmarks, region} = this.props
        const {order} = this.state

        let signIn = null
        let list = []

        if (!user) signIn = <p>{t('bookmarksSignIn')}</p>
        bookmarks
            .map(bookmark =>
                bookmark.set('index', order.indexOf(bookmark.getIn(['item', '_id'], 0).toString()))
            )
            .sort((a, b) => a.get('index') - b.get('index'))
            .forEach(bookmark => {
                let item = bookmark.get('item')
                list.push(
                    <Link
                        className="market-bookmark-list-item"
                        to={`/market/${region}/${item.get('_id')}`}
                        key={item.get('_id')}
                        data-id={item.get('_id')}>
                        <img className="item-icon" alt={item.get('name')} src={item.get('icon')} />
                        <div className="item-details">
                            <p className={`grade_${item.get('grade')}`}>{item.get('name')}</p>
                            {parsePrice(bookmark)}
                        </div>
                    </Link>
                )
            })

        return (
            <div className="market-bookmark-list">
                <h4>{t('bookmarks')}</h4>
                {signIn}
                <Sortable onChange={order => this.reorder(order)} className="sortable">
                    {list}
                </Sortable>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('market')(MarketBookmarkList))
