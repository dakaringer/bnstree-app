import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Link} from 'react-router-dom'

import {viewSelector} from '../../../selectors'
import {search, loadItem, searchItem} from '../actions'
import {searchSelector, suggestionsSelector} from '../selectors'

import {Icon, Checkbox} from 'antd'

const mapStateToProps = state => {
    return {
        search: searchSelector(state),
        suggestions: suggestionsSelector(state),
        region: viewSelector(state).get('marketRegion', 'na')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSearch: value => dispatch(search(value)),
        loadItem: id => dispatch(loadItem(id)),
        searchItem: (search, history, exact) => dispatch(searchItem(search, history, exact))
    }
}

class MarketSearch extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            exact: false
        }
    }

    handleKey(e) {
        const {region, search, suggestions, history, searchItem} = this.props
        let size = suggestions.size
        let index = this.state.index
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                index += 1
                break
            case 'ArrowUp':
                e.preventDefault()
                index -= 1
                break
            case 'Enter':
                e.preventDefault()
                if (search.trim() !== '') {
                    if (index === 0) {
                        searchItem(search, history, this.state.exact)
                    } else {
                        let id = suggestions.getIn([index - 1, '_id'], null)
                        if (id) history.push(`/market/${region}/${id}`)
                    }
                }
                break
            default:
                index += 0
        }

        if (index >= size) index = size
        if (index < 0) index = 0

        this.setState({
            index: index
        })
    }

    handleSearch(value) {
        this.props.setSearch(value)
        this.setState({
            index: 0
        })
    }

    handleExact(value) {
        this.setState({
            exact: value
        })
    }

    render() {
        const {t, search, suggestions, region, history, searchItem} = this.props

        let suggestionList = []
        if (search.trim() !== '') {
            suggestionList.push(
                <div
                    className={`suggestion-item ${this.state.index === 0 ? 'selected' : ''}`}
                    key="search"
                    onClick={() => searchItem(search, history)}>
                    <span>{search}</span>
                </div>
            )
        }
        suggestions.forEach((item, i) => {
            suggestionList.push(
                <Link
                    className={`suggestion-item ${this.state.index === i + 1 ? 'selected' : ''}`}
                    key={item.get('_id')}
                    to={`/market/${region}/${item.get('_id')}`}>
                    <img alt={item.get('name')} src={item.get('icon')} />
                    <span className={`grade_${item.get('grade')}`}>{item.get('name')}</span>
                </Link>
            )
        })

        let clear = search ? (
            <Icon onClick={() => this.handleSearch('')} className="clear" type="close" />
        ) : null

        return (
            <div className="market-search">
                <div className="market-search-input-group">
                    <div className="market-search-input">
                        <input
                            placeholder={t('search')}
                            value={search}
                            onChange={e => this.handleSearch(e.target.value)}
                            onKeyDown={e => this.handleKey(e)}
                        />
                        {clear}
                    </div>
                    <Checkbox
                        checked={this.state.exact}
                        onChange={e => this.handleExact(e.target.checked)}>
                        {t('exact')}
                    </Checkbox>
                </div>
                <div className="market-search-suggestions">
                    {search.trim() !== '' ? suggestionList : null}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('market')(MarketSearch))
