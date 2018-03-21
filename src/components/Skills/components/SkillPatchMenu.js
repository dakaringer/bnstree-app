import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Map } from 'immutable'

import {
    patchSelector,
    namedPatchDataSelector,
    namedSkillDataSelector,
    classElementDataSelector
} from '../selectors'
import { patchListSelector } from '../../References/selectors'
import { selectPatch } from '../actions'

import SkillTooltip from './SkillTooltip'

import { Modal, Icon, Menu, Row, Col, Tooltip } from 'antd'

const mapStateToProps = state => {
    return {
        currentPatch: patchSelector(state),
        patchList: patchListSelector(state),
        patchData: namedPatchDataSelector(state),
        baseData: namedSkillDataSelector(state),
        classElements: classElementDataSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        selectPatch: patch => dispatch(selectPatch(patch))
    }
}

class SkillPatchMenu extends React.PureComponent {
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
        const {
            t,
            currentPatch,
            patchList,
            patchData,
            baseData,
            classElements,
            selectPatch
        } = this.props
        const { show } = this.state

        let patches = []
        patchList.forEach(p => {
            let id = p.get('_id')
            let name = <span>{p.get('name', '')}</span>
            if (p.get('base')) {
                name = (
                    <span>
                        {p.get('name', '')} <small key="current">(NA/EU)</small>
                    </span>
                )
            }
            patches.push(<Menu.Item key={id}>{name}</Menu.Item>)
        })
        let patchMenu = (
            <Menu
                theme="dark"
                onClick={e => selectPatch(e.key)}
                selectedKeys={[currentPatch.toString()]}
                className="patch-list">
                {patches}
            </Menu>
        )

        let changelog = []
        patchData.forEach((patch, id) => {
            if (patch.get('patch') === currentPatch) {
                let skill = patch.get('skill')
                let base = baseData.get(id)
                let move = skill.get('move')
                let classification =
                    move > 3 ? t('moveTypeHM', { move: move - 3 }) : t('moveType', { move: move })
                classification = move ? ` ${classification}` : ''
                let element = null
                if (skill.has('elementSpec')) {
                    element = ` (${t(skill.get('elementSpec'))})`
                }

                if (!skill.has('removed')) {
                    let split = false
                    let tooltip = <SkillTooltip moveData={skill} comparisonData={base || skill} />

                    if (!skill.has('elementSpec') && base) {
                        let element1 = classElements.getIn([0, 'element'])
                        let patch1 = filterElement(skill, element1)
                        let base1 = filterElement(base, element1)
                        let element2 = classElements.getIn([1, 'element'])
                        let patch2 = filterElement(skill, element2)
                        let base2 = filterElement(base, element2)

                        if (!patch1.equals(patch2)) {
                            split = true
                            if (!base1.equals(patch1)) {
                                tooltip = (
                                    <SkillTooltip
                                        moveData={skill}
                                        comparisonData={base || skill}
                                        elementOverride={element1}
                                    />
                                )
                                changelog.push(
                                    <PatchItem
                                        tooltip={tooltip}
                                        patch={skill}
                                        classification={classification}
                                        element={` (${t(element1)})`}
                                        key={`${id}-${element1}`}
                                    />
                                )
                            }

                            if (!base2.equals(patch2)) {
                                tooltip = (
                                    <SkillTooltip
                                        moveData={skill}
                                        comparisonData={base || skill}
                                        elementOverride={element2}
                                    />
                                )
                                changelog.push(
                                    <PatchItem
                                        tooltip={tooltip}
                                        patch={skill}
                                        classification={classification}
                                        element={` (${t(element2)})`}
                                        key={`${id}-${element2}`}
                                    />
                                )
                            }
                        }
                    }

                    if (!split) {
                        changelog.push(
                            <PatchItem
                                tooltip={tooltip}
                                patch={skill}
                                classification={classification}
                                element={element}
                                key={id}
                                added={!base ? t('patchAdded') : false}
                            />
                        )
                    }
                } else {
                    changelog.push(
                        <div className="patch-item removed" key={id}>
                            <img
                                className="skill-icon"
                                alt={skill.get('skillId')}
                                src={`https://static.bnstree.com/images/skills/${skill.get(
                                    'icon',
                                    'blank'
                                )}`}
                            />
                            <div>
                                <span className="skill-name">
                                    {skill.get('name')}
                                    <small>
                                        {move ? ` ${classification}` : ''}
                                        {element}
                                    </small>
                                </span>
                                <span className="removed-text">{t('patchRemoved')}</span>
                            </div>
                        </div>
                    )
                }
            }
        })

        return (
            <div className="patch sub-menu-item">
                <a onClick={() => this.toggleModal()}>
                    <Icon type="calendar" /> {t('patch')}
                </a>
                <Modal
                    title={t('patch')}
                    visible={show}
                    onCancel={() => this.toggleModal()}
                    footer={null}
                    width={600}
                    wrapClassName="patch-menu">
                    <Row>
                        <Col sm={6}>
                            <h5>{t('patchList')}</h5>
                            {patchMenu}
                        </Col>
                        <Col sm={18}>
                            <h5>{t('patchChangelog')}</h5>
                            <div className="changelog">
                                {changelog.length > 0 ? (
                                    changelog
                                ) : (
                                        <p className="no-change">{t('patchNoChange')}</p>
                                    )}
                            </div>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('classes')(SkillPatchMenu))

function filterElement(patch, element) {
    let attributes = patch.get('attributes', Map())
    attributes = attributes.map((group, type) => {
        return group.filter(attb => attb.get(2, element) === element)
    })

    let info = patch.get('info', Map())
    info = info.get(element, info)

    let subAttributes = patch.get('subAttributes', Map())
    subAttributes = subAttributes.map((group, type) => {
        return group.filter(attb => attb.getIn(['text', 2], element) === element)
    })

    return patch
        .set('attributes', attributes)
        .set('info', info)
        .set('subAttributes', subAttributes)
}

const PatchItem = props => {
    const { tooltip, patch, classification, element, added } = props

    let addText = added ? <span className="added-text">{added}</span> : null

    return (
        <Tooltip
            placement="topLeft"
            title={tooltip}
            overlayClassName="skill-tooltip-wrap"
            trigger="click">
            <div className="patch-item">
                <img
                    className="skill-icon"
                    alt={patch.get('skillId')}
                    src={`https://static.bnstree.com/images/skills/${patch.get('icon', 'blank')}`}
                />
                <p className="skill-name">
                    {patch.get('name')}
                    <small>
                        {classification}
                        {element}
                    </small>
                </p>
                {addText}
            </div>
        </Tooltip>
    )
}
