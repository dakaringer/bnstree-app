import React from 'react'
import {connect} from 'react-redux'

import {viewSelector} from '../selectors'

import AdminNewsList from './AdminNewsList'

const mapStateToProps = state => {
    return {
        view: viewSelector(state)
    }
}

const AdminMainMenu = props => {
    let {view} = props

    let content = null
    switch (view) {
        case 'news':
            content = <AdminNewsList />
            break
        default:
            content = null
    }

    return <div className="admin-main-menu">{content}</div>
}

export default connect(mapStateToProps)(AdminMainMenu)
