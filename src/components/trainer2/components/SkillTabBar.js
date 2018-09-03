import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {currentTabSelector, buildListSelector, uiTextSelector} from '../selector'
import {addTab, deleteTab, setTab, renameTab, resetBuild} from '../actions'

import {Icon, Modal, Button, Menu} from 'antd'

const mapStateToProps = (state) => {
    return {
        currentTab: currentTabSelector(state),
        builds: buildListSelector(state),
        uiText: uiTextSelector(state).get('SKILL_TAB_BAR', Map())
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addTab: () => dispatch(addTab()),
        deleteTab: (e, i) => {
            e.stopPropagation()
            e.preventDefault()
            dispatch(deleteTab(i))
        },
        setTab: (i) => dispatch(setTab(i)),
        renameTab: (e) => dispatch(renameTab(e.target.value)),
        resetTab: () => dispatch(resetBuild())
    }
}

class SkillTabBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: {
                rename: false,
                reset: false
            }
        }
    }

    close(type) {
        let modal = this.state.modal
        modal[type] = false
        this.setState({modal: modal})
    }

    open(type) {
        let modal = this.state.modal
        modal[type] = true
        this.setState({modal: modal})
    }

    blurInput(e, type) {
        if (e.key === 'Enter') {
            e.target.blur()
            this.close(type)
        }
    }

    reset() {
        this.close('reset')
        this.props.resetTab()
    }

    clickTab(i) {
        if (i == this.props.currentTab) {
            this.open('rename')
        }
        else {
            this.props.setTab(i)
        }
    }

    render() {
        let tabs = []
        let oneTab = this.props.builds.size <= 1
        this.props.builds.forEach((b, i) => {
            let close = oneTab ? null : <Icon type="cross" onClick={(e) => this.props.deleteTab(e, i)}/>
            let name = b.get('name', '')
            tabs.push(
                <Menu.Item key={i}>
                    <span className='tab-name'>{name != '' ? name : this.props.uiText.get('defaultBuild') + (i + 1)}</span>
                    {close}
                </Menu.Item>
            )
        })

        let currentTabName = this.props.builds.getIn([this.props.currentTab, 'name'], '')

        return (
            <div className='tabBar skillTabBar'>
                <div className='tabContainer'>
                    <div className='tabs'>
                        <Menu mode="horizontal" onClick={(e) => this.clickTab(e.key)} selectedKeys={[this.props.currentTab.toString()]}>
                            {tabs}
                        </Menu>
                    </div>
                    <a onClick={() => this.props.addTab()} className='functionLink'>
                        <Icon type="plus"/> <span>{this.props.uiText.get('newTab')}</span>
                    </a>
                    <a onClick={() => this.open('reset')} className='functionLink'><Icon type="reload"/> <span>{this.props.uiText.get('reset')}</span></a>
                </div>

                <Modal visible={this.state.modal.rename} title={null} footer={null} className='renameModal' onCancel={() => this.close('rename')}>
                    <label>{this.props.uiText.get('rename', '')}</label>
                    <input onChange={(e) => this.props.renameTab(e)} onKeyPress={(e) => this.blurInput(e, 'rename')} value={currentTabName}/>
                </Modal>
                <Modal
                    visible={this.state.modal.reset}
                    title={this.props.uiText.get('resetHeader', '')}
                    footer={[
                        <Button type='danger' onClick={() => this.reset()} ghost>{this.props.uiText.get('reset', '')}</Button>,
                        <Button onClick={() => this.close('reset')} ghost>{this.props.uiText.get('cancel', '')}</Button>
                    ]}
                    className='resetModal'
                    onCancel={() => this.close('reset')}
                >
                    <p>{this.props.uiText.get('resetInfo', '')}</p>
                    <div className='buttons'>

                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillTabBar)
