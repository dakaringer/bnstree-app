import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {Modal, Icon, Tooltip} from 'antd'
import {Radio, RadioGroup} from 'react-radio-group'

import {viewSelector, charSelector} from '../selectors'
import {updateView, setStat} from '../actions.js'

const mapStateToProps = state => {
    return {
        view: viewSelector(state),
        character: charSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateView: (type, value) => dispatch(updateView(type, value)),
        setStat: (stat, value) => {
            const reg = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/
            if ((!isNaN(value) && reg.test(value)) || value === '') {
                dispatch(setStat(stat, value))
            }
        }
    }
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
        const {t, view, character, updateView, setStat} = this.props
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
                        <RadioGroup
                            selectedValue={view.get('order', 'LEVEL')}
                            onChange={value => updateView('order', value)}>
                            <label>
                                <Radio value="LEVEL" />
                                {t('level')}
                            </label>
                            <label>
                                <Radio value="HOTKEY" />
                                {t('hotkey')}
                            </label>
                        </RadioGroup>
                    </td>
                </tr>
            )
        }

        return (
            <div className="settings sub-menu-item">
                <a onClick={() => this.toggleModal()}>
                    {t('settings')} <Icon type="setting" />
                </a>
                <Modal
                    title={t('settings')}
                    visible={show}
                    onCancel={() => this.toggleModal()}
                    footer={null}
                    wrapClassName="skill-settings">
                    <h5>
                        {t('characterStats')}
                    </h5>
                    <table className="character-stats">
                        <tbody>
                            <tr>
                                <td>
                                    <label>
                                        {t('attackPower')}
                                    </label>
                                </td>
                                <td>
                                    <input
                                        value={character.get('ap', 13)}
                                        onChange={e => setStat('ap', e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>
                                        {t('attackPowerPet')}
                                    </label>
                                </td>
                                <td>
                                    <input
                                        value={character.get('apPet', 5)}
                                        onChange={e => setStat('apPet', e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>
                                        {t('additionalDamage')}
                                    </label>
                                </td>
                                <td>
                                    <input
                                        value={character.get('ad', 0)}
                                        onChange={e => setStat('ad', e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>
                                        {t('weaponConstant')}{' '}
                                        <Tooltip
                                            placement="bottomLeft"
                                            title={t('weaponConstantInfo')}>
                                            <Icon className="help" type="question-circle-o" />
                                        </Tooltip>
                                    </label>
                                </td>
                                <td>
                                    <input
                                        value={character.get('c', 1)}
                                        onChange={e => setStat('c', e.target.value)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr />
                    <table>
                        <tbody>
                            <tr className="switchGroup">
                                <td>
                                    <label>
                                        {t('mode')}
                                    </label>
                                </td>
                                <td>
                                    <RadioGroup
                                        selectedValue={view.get('mode', 'LIST')}
                                        onChange={value => updateView('mode', value)}>
                                        <label>
                                            <Radio value="LIST" />
                                            {t('list')}
                                        </label>
                                        <label>
                                            <Radio value="ICON" />
                                            {t('icon')}
                                        </label>
                                    </RadioGroup>
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
