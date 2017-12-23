import React from 'react'
import {connect} from 'react-redux'

import {flushCache, setView} from '../actions'
import {viewSelector} from '../selectors'

import {Button} from 'antd'

const mapStateToProps = state => {
    return {
        view: viewSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setView: view => dispatch(setView(view)),
        flushCache: () => flushCache()
    }
}

const AdminSideMenu = props => {
    let {view, setView, flushCache} = props
    return (
        <div className="admin-side-menu">
            <ul>
                <li className={`admin-side-menu-item ${view === 'news' ? 'active' : ''}`}>
                    <a onClick={() => setView('news')}>News</a>
                </li>
                <li className={`admin-side-menu-item ${view === 'guides' ? 'active' : ''}`}>
                    <a onClick={() => setView('guides')}>Guides</a>
                </li>
            </ul>
            <hr />
            <Button className="flush-cache" type="danger" onClick={() => flushCache()}>
                Flush Cache
            </Button>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminSideMenu)
