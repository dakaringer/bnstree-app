import React from 'react'
import {connect} from 'react-redux'

import {flushCache, setView} from '../actions'
import {viewSelector} from '../selectors'

import {Button, Collapse} from 'antd'
const Panel = Collapse.Panel

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
            <Collapse bordered={false} defaultActiveKey="articles">
                <Panel header={<div>Articles</div>} key="articles">
                    <ul>
                        <a
                            className={`admin-side-menu-item ${view === 'news' ? 'active' : ''}`}
                            onClick={() => setView('news')}>
                            <li>News</li>
                        </a>
                        <a
                            className={`admin-side-menu-item ${view === 'guides' ? 'active' : ''}`}
                            onClick={() => setView('guides')}>
                            <li>Guides</li>
                        </a>
                    </ul>
                </Panel>
            </Collapse>
            <hr />
            <Button className="flush-cache" type="danger" onClick={() => flushCache()}>
                Flush Cache
            </Button>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminSideMenu)
