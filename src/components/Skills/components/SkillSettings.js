import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {Modal, Switch, Icon} from 'antd'

import {viewSelector} from '../selectors'
import {updateView} from '../actions.js'

const mapStateToProps = state => {
    return {
        view: viewSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {updateView: (type, value) => dispatch(updateView(type, value))}
}

class SkillSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
    }

    toggleModal() {
        this.setState({
            show: !this.state.show
        })
    }

    render() {
        const {t, view, updateView} = this.props
        const {show} = this.state

        let sortDiv = null
        if (view.get('mode', 'LIST') === 'LIST') {
            sortDiv = (
                <div className="switchGroup">
                    <label>
                        {t('sort')}:
                    </label>
                    <Switch
                        checked={view.get('order', 'LEVEL') === 'HOTKEY'}
                        unCheckedChildren={t('level')}
                        checkedChildren={t('hotkey')}
                        onChange={checked => updateView('order', checked ? 'HOTKEY' : 'LEVEL')}
                    />
                </div>
            )
        }

        return (
            <div className="settings sub-header-item">
                <a onClick={() => this.toggleModal()}>
                    {t('settings')} <Icon type="setting" />
                </a>
                <Modal
                    title={t('settings')}
                    visible={show}
                    onCancel={() => this.toggleModal()}
                    footer={null}
                    wrapClassName="skill-settings">
                    <div className="switchGroup">
                        <label>
                            {t('mode')}:
                        </label>
                        <Switch
                            checked={view.get('mode', 'LIST') === 'ICON'}
                            unCheckedChildren={t('list')}
                            checkedChildren={t('icon')}
                            onChange={checked => updateView('mode', checked ? 'ICON' : 'LIST')}
                        />
                    </div>
                    {sortDiv}
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('skills')(SkillSettings))
