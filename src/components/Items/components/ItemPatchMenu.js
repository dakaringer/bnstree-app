import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {
    patchListSelector,
    patchSelector,
    namedPatchDataSelector,
    namedSkillDataSelector,
    classElementDataSelector
} from '../selectors'
import {selectPatch} from '../actions'

import {Modal, Icon, Menu, Row, Col} from 'antd'

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
        const {t, currentPatch, patchList, selectPatch} = this.props
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
                            <div className="changelog" />
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('items')(SkillPatchMenu))
