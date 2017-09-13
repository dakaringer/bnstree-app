import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import Sortable from 'react-sortablejs'

import {userSelector} from '../../../selectors'
import {bookmarksSelector} from '../selectors'
import {loadBookmarks, loadItem} from '../actions'

import {parsePrice} from '../parser'

const mapStateToProps = state => {
    return {
        user: userSelector(state),
        bookmarks: bookmarksSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadBookmarks: () => dispatch(loadBookmarks()),
        loadItem: id => dispatch(loadItem(id))
    }
}

class MarketBookmarkList extends PureComponent {
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
        fetch('https://api.bnstree.com/market/bookmark/reorder', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({order: order})
        }).catch(e => console.log(e))
    }

    render() {
        const {t, user, bookmarks, loadItem} = this.props
        const {order} = this.state

        let signIn = null
        let list = []

        if (!user) signIn = <p>{t('bookmarksSignIn')}</p>
        bookmarks
            .map(bookmark =>
                bookmark.set('index', order.indexOf(bookmark.getIn(['item', '_id'], 0).toString()))
            )
            .sort((a, b) => a.get('index') > b.get('index'))
            .forEach(bookmark => {
                let item = bookmark.get('item')
                list.push(
                    <a
                        className="market-bookmark-list-item"
                        onClick={() => loadItem(item.get('_id'))}
                        key={item.get('_id')}
                        data-id={item.get('_id')}>
                        <img alt={item.get('name')} src={item.get('icon')} />
                        <div>
                            <p className={`grade_${item.get('grade')}`}>{item.get('name')}</p>
                            {parsePrice(bookmark)}
                        </div>
                    </a>
                )
            })

        return (
            <div className="market-bookmark-list">
                <h4>{t('bookmarks')}</h4>
                {signIn}
                <Sortable onChange={order => this.reorder(order)}>{list}</Sortable>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('market')(MarketBookmarkList))
