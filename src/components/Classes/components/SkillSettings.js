import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {viewSelector, charSelector} from '../selectors'
import {updateView, setStat} from '../actions.js'

import {Modal, Icon, Tooltip, Radio} from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

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
                        <p>
                            {t('sort')}
                        </p>
                    </td>
                    <td>
                        <RadioGroup
                            size="small"
                            value={view.get('order', 'LEVEL')}
                            onChange={e => updateView('order', e.target.value)}>
                            <RadioButton value="LEVEL">
                                {t('level')}
                            </RadioButton>
                            <RadioButton value="HOTKEY">
                                {t('hotkey')}
                            </RadioButton>
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
                                    <p>
                                        {t('attackPower')}
                                    </p>
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
                                    <p>
                                        {t('attackPowerPet')}
                                    </p>
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
                                    <p>
                                        {t('additionalDamage')}
                                    </p>
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
                                    <p>
                                        {t('weaponConstant')}{' '}
                                        <Tooltip
                                            placement="bottomLeft"
                                            title={t('weaponConstantInfo')}>
                                            <Icon className="help" type="question-circle-o" />
                                        </Tooltip>
                                    </p>
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
                                    <p>
                                        {t('mode')}
                                    </p>
                                </td>
                                <td>
                                    <RadioGroup
                                        size="small"
                                        value={view.get('mode', 'LIST')}
                                        onChange={e => updateView('mode', e.target.value)}>
                                        <RadioButton value="LIST">
                                            {t('list')}
                                        </RadioButton>
                                        <RadioButton value="ICON">
                                            {t('icon')}
                                        </RadioButton>
                                    </RadioGroup>
                                </td>
                            </tr>
                            {sortDiv}
                        </tbody>
                    </table>
                    <hr />
                    <div>
                        <p>
                            {t('patch')}
                        </p>

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
