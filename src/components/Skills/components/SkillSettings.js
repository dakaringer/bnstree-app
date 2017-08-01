import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {Modal, Switch, Icon, Dropdown} from 'antd'

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
                <tr className="switchGroup">
                    <td>
                        <label>
                            {t('sort')}
                        </label>
                    </td>
                    <td>
                        <Switch
                            checked={view.get('order', 'LEVEL') === 'HOTKEY'}
                            unCheckedChildren={t('level')}
                            checkedChildren={t('hotkey')}
                            onChange={checked => updateView('order', checked ? 'HOTKEY' : 'LEVEL')}
                        />
                    </td>
                </tr>
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
                    <table>
                        <tbody>
                            <tr className="switchGroup">
                                <td>
                                    <label>
                                        {t('mode')}
                                    </label>
                                </td>
                                <td>
                                    <Switch
                                        checked={view.get('mode', 'LIST') === 'ICON'}
                                        unCheckedChildren={t('list')}
                                        checkedChildren={t('icon')}
                                        onChange={checked =>
                                            updateView('mode', checked ? 'ICON' : 'LIST')}
                                    />
                                </td>
                            </tr>
                            {sortDiv}
                        </tbody>
                    </table>
                    <hr />
                    <div>
                        <label>
                            {t('patch')}
                        </label>

                        <a className="patch-selector" disabled>
                            KR 7.19 <Icon type="down" />
                        </a>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('skills')(SkillSettings))
