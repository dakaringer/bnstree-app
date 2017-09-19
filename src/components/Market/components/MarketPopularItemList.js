import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {popularItemsSelector} from '../selectors'
import {loadPopularItems, loadItem} from '../actions'

import {parsePrice} from '../parser'

const mapStateToProps = state => {
    return {
        popularItems: popularItemsSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadPopularItems: () => dispatch(loadPopularItems()),
        loadItem: id => dispatch(loadItem(id))
    }
}

class MarketPopularItemList extends React.PureComponent {
    componentDidMount() {
        this.props.loadPopularItems()
        let intervalId = setInterval(() => this.props.loadPopularItems(), 300000)
        this.setState({
            intervalId: intervalId
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId)
    }

    render() {
        const {popularItems, loadItem} = this.props

        let list = []
        popularItems.forEach(popularItem => {
            let item = popularItem.get('item')
            list.push(
                <Link
                    to="/market"
                    className="market-popular-item-list-item"
                    onClick={() => loadItem(item.get('_id'))}
                    key={item.get('_id')}>
                    <img alt={item.get('name')} src={item.get('icon')} />
                    <div className="item-desc">
                        <p className={`grade_${item.get('grade')}`}>{item.get('name')}</p>
                        {parsePrice(popularItem)}
                    </div>
                </Link>
            )
        })

        return <div className="market-popular-item-list">{list}</div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketPopularItemList)
