import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

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

    render() {
        const {t, user, bookmarks, loadItem} = this.props

        let signIn = null
        let list = []

        if (!user) signIn = <p>{t('bookmarksSignIn')}</p>
        bookmarks.forEach(bookmark => {
            let item = bookmark.get('item')
            list.push(
                <a
                    className="market-bookmark-list-item"
                    onClick={() => loadItem(item.get('_id'))}
                    key={item.get('_id')}>
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
                {list}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('market')(MarketBookmarkList))
