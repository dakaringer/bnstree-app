import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {viewSelector, charSelector} from '../selectors'
import {updateView, setStat, setElementDmg} from '../actions.js'

import elementImages from '../images/map_elementImg'

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
            const reg = /^(0|[1-9][0-9]*)$/
            if ((!isNaN(value) && reg.test(value)) || value === '') {
                dispatch(setStat(stat, value))
            }
        },
        setElementDmg: (e, value) => {
            const reg = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/
            if ((!isNaN(value) && reg.test(value)) || value === '') {
                dispatch(setElementDmg(e, value))
            }
        }
    }
}

const elements = ['flame', 'frost', 'wind', 'earth', 'lightning', 'shadow']

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
        const {t, view, character, updateView, setStat, setElementDmg} = this.props
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

        let elementDamage = []
        elements.forEach(element => {
            elementDamage.push(
                <tr key={element}>
                    <td>
                        <p>
                            <img
                                className="element-img"
                                alt={element}
                                src={elementImages[element]}
                            />
                            {t(element)}
                        </p>
                    </td>
                    <td>
                        <input
                            value={character.getIn(['element', element], 100)}
                            onChange={e => setElementDmg(element, e.target.value)}
                        />
                    </td>
                </tr>
            )
        })

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
                    <h5>
                        {t('elementDamage')}
                    </h5>
                    <table>
                        <tbody>
                            {elementDamage}
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
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <p>
                                        {t('patch')}
                                    </p>
                                </td>
                                <td>
                                    <a className="patch-selector" disabled>
                                        KR 7.19 <Icon type="down" />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('skills')(SkillSettings))
