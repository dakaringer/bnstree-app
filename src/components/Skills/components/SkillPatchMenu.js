import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map} from 'immutable'

import {
    patchListSelector,
    patchSelector,
    namedPatchDataSelector,
    namedSkillDataSelector,
    classElementDataSelector
} from '../selectors'
import {selectPatch} from '../actions'

import SkillTooltip from './SkillTooltip'

import {Modal, Icon, Menu, Row, Col, Tooltip} from 'antd'

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
        const {show} = this.state

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
            let base = baseData.get(id)
            let move = patch.get('move')
            let classification =
                move > 3 ? t('moveTypeHM', {move: move - 3}) : t('moveType', {move: move})
            classification = move ? ` ${classification}` : ''
            let element = null
            if (patch.has('elementSpec')) {
                element = ` (${t(patch.get('elementSpec'))})`
            }

            if (patch.size > 6) {
                let split = false
                let tooltip = <SkillTooltip moveData={patch} comparisonData={base || patch} />

                if (!patch.has('elementSpec')) {
                    let element1 = classElements.getIn([0, 'element'])
                    let patch1 = filterElement(patch, element1)
                    let base1 = filterElement(base, element1)
                    let element2 = classElements.getIn([1, 'element'])
                    let patch2 = filterElement(patch, element2)
                    let base2 = filterElement(base, element2)

                    if (!patch1.equals(patch2)) {
                        split = true
                        if (!base1.equals(patch1)) {
                            tooltip = (
                                <SkillTooltip
                                    moveData={patch}
                                    comparisonData={base || patch}
                                    elementOverride={element1}
                                />
                            )
                            changelog.push(
                                <PatchItem
                                    tooltip={tooltip}
                                    patch={patch}
                                    classification={classification}
                                    element={` (${t(element1)})`}
                                    key={`${id}-${element1}`}
                                />
                            )
                        }

                        if (!base2.equals(patch2)) {
                            tooltip = (
                                <SkillTooltip
                                    moveData={patch}
                                    comparisonData={base || patch}
                                    elementOverride={element2}
                                />
                            )
                            changelog.push(
                                <PatchItem
                                    tooltip={tooltip}
                                    patch={patch}
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
                            patch={patch}
                            classification={classification}
                            element={element}
                            key={id}
                        />
                    )
                }
            } else {
                changelog.push(
                    <div className="patch-item removed" key={id}>
                        <img
                            className="skill-icon"
                            alt={patch.get('skillId')}
                            src={`https://static.bnstree.com/images/skills/${patch.get(
                                'icon',
                                'blank'
                            )}`}
                        />
                        <div>
                            <span className="skill-name">
                                {patch.get('name')}
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
        })

        return (
            <div className="patch sub-menu-item">
                <a onClick={() => this.toggleModal()}>
                    {t('patch')} <Icon type="calendar" />
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
    const {tooltip, patch, classification, element} = props

    return (
        <Tooltip
            placement="bottomLeft"
            title={tooltip}
            align={{overflow: {adjustY: false, adjustX: true}}}
            overlayClassName="skill-tooltip-wrap"
            trigger={['click']}>
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
            </div>
        </Tooltip>
    )
}
