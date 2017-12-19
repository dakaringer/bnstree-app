import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {patchSelector, namedPatchDataSelector, typeSelector} from '../selectors'
import {patchListSelector} from '../../References/selectors'
import {selectPatch} from '../actions'

import {Modal, Icon, Menu, Row, Col} from 'antd'

const mapStateToProps = state => {
    return {
        currentPatch: patchSelector(state),
        patchList: patchListSelector(state),
        patchData: namedPatchDataSelector(state),
        type: typeSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        selectPatch: patch => dispatch(selectPatch(patch))
    }
}

class ItemPatchMenu extends React.PureComponent {
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
        const {t, type, currentPatch, patchList, patchData, selectPatch} = this.props
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

        let affectedItems = []
        patchData.forEach((patch, id) => {
            let imgUrl = `https://static.bnstree.com/images/${type}`
            let className = null
            if (patch.has('classCode')) {
                className = ` ${t(patch.get('classCode'))}`
            }
            affectedItems.push(
                <div className="patch-item" key={id}>
                    <img
                        className="item-icon"
                        alt={patch.get('name')}
                        src={`${imgUrl}/${patch.get('icon')}`}
                    />
                    <div>
                        <span className={`grade_${patch.get('grade')}`}>
                            {patch.get('name')}
                            <small>{className}</small>
                        </span>
                    </div>
                </div>
            )
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
                    wrapClassName="item-patch-menu">
                    <Row>
                        <Col sm={6}>
                            <h5>{t('patchList')}</h5>
                            {patchMenu}
                        </Col>
                        <Col sm={18}>
                            <h5>{t('patchChangelog')}</h5>
                            <div className="changelog">
                                {affectedItems.length > 0 ? (
                                    affectedItems
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

export default connect(mapStateToProps, mapDispatchToProps)(translate('items')(ItemPatchMenu))
