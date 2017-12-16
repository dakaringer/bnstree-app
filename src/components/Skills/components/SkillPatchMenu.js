import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {
    patchListSelector,
    patchSelector,
    namedPatchDataSelector,
    namedSkillDataSelector
} from '../selectors'
import {selectPatch} from '../actions'

import SkillTooltip from './SkillTooltip'

import {Modal, Icon, Menu, Row, Col, Tooltip} from 'antd'

const mapStateToProps = state => {
    return {
        currentPatch: patchSelector(state),
        patchList: patchListSelector(state),
        patchData: namedPatchDataSelector(state),
        baseData: namedSkillDataSelector(state)
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
        const {t, currentPatch, patchList, patchData, baseData, selectPatch} = this.props
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
            let element = null
            if (patch.has('elementSpec')) {
                element = ` (${t(patch.get('elementSpec'))})`
            }
            if (patch.size > 6) {
                let tooltip = <SkillTooltip moveData={patch} comparisonData={base || patch} />

                changelog.push(
                    <Tooltip
                        placement="bottomLeft"
                        title={tooltip}
                        align={{overflow: {adjustY: false, adjustX: true}}}
                        overlayClassName="skill-tooltip-wrap"
                        trigger={['click']}
                        key={id}>
                        <div className="patch-item">
                            <img
                                className="skill-icon"
                                alt={patch.get('skillId')}
                                src={`https://static.bnstree.com/images/skills/${patch.get(
                                    'icon',
                                    'blank'
                                )}`}
                            />
                            <p className="skill-name">
                                {patch.get('name')}
                                <small>
                                    {move ? ` ${classification}` : ''}
                                    {element}
                                </small>
                            </p>
                        </div>
                    </Tooltip>
                )
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
