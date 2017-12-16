import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {userSelector} from '../../../selectors'
import {
    buildElementSelector,
    buildSelector,
    classElementDataSelector,
    basePatchSelector,
    patchSelector,
    buildFormatSelector
} from '../selectors'
import {postBuild} from '../actions'

import {Icon, Modal, Button, Radio} from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

function generateLink(element, build, buildFormat, elementData) {
    let elementIndex = elementData.findIndex(a => a.get('element') === element)
    let buildString = ''
    buildFormat.forEach(id => {
        let trait = build.get(id, '1')
        buildString += parseInt(trait, 10)
    })
    return elementIndex + buildString
}

const mapStateToProps = state => {
    let base = basePatchSelector(state)
    return {
        user: userSelector(state),
        element: buildElementSelector(state),
        buildData: buildSelector(state),
        buildFormat: buildFormatSelector(state),
        elementData: classElementDataSelector(state),
        isBase: base.get('_id') === patchSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        postBuild: (title, type, buildCode) => dispatch(postBuild(title, type, buildCode))
    }
}

class SkillShareMenu extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            title: '',
            type: 'PvE',
            noTitle: false
        }
    }

    toggleModal() {
        this.setState({
            show: !this.state.show
        })
    }

    setType(type) {
        this.setState({
            type: type
        })
    }

    changeTitle(e) {
        let title = e.target.value
        if (title.length > 100) return
        this.setState({
            title: title
        })
    }

    post(buildCode) {
        let {isBase, postBuild} = this.props
        let {title, type} = this.state

        if (isBase) {
            if (title.trim() === '') {
                this.setState({
                    noTitle: true
                })
            } else {
                postBuild(title, type, buildCode)

                this.setState({
                    title: '',
                    type: 'PvE',
                    show: false,
                    noTitle: false
                })
            }
        }
    }

    render() {
        const {t, user, element, buildData, buildFormat, elementData, isBase} = this.props
        const {show, title, type, noTitle} = this.state

        let buildCode = generateLink(element, buildData, buildFormat, elementData)

        let errorMsg = null
        if (noTitle) {
            errorMsg = <span className="error">{t('noTitle')}</span>
        }
        if (!isBase) {
            errorMsg = <span className="error">{t('notBasePatch')}</span>
        }

        return (
            <div className="share sub-menu-item">
                <a onClick={() => this.toggleModal()}>
                    {t('general:share')} <Icon type="share-alt" />
                </a>
                <Modal
                    title={t('general:share')}
                    visible={show}
                    onCancel={() => this.toggleModal()}
                    footer={null}
                    wrapClassName="skill-share-menu">
                    <div>
                        <input
                            className="share-link"
                            readOnly
                            value={`${window.location.protocol}//${window.location.host +
                                window.location.pathname}?b=${buildCode}`}
                            onClick={e => e.target.select()}
                        />
                    </div>
                    <hr />
                    <div>
                        <h4>Post on BnSTree</h4>
                        <input
                            className="build-title"
                            placeholder={user ? t('title') : t('loginRequired')}
                            value={title}
                            onChange={e => this.changeTitle(e)}
                            disabled={!user}
                        />
                        <div className="typeSelector">
                            <p>{t('type')}</p>
                            <RadioGroup
                                size="small"
                                value={type}
                                onChange={e => this.setType(e.target.value)}
                                disabled={!user}>
                                <RadioButton value="PvE">{t('PvE')}</RadioButton>
                                <RadioButton value="PvP">{t('PvP')}</RadioButton>
                                <RadioButton value="6v6">{t('6v6')}</RadioButton>
                            </RadioGroup>
                        </div>
                        <Button
                            className="post"
                            type="primary"
                            onClick={() => this.post(buildCode)}
                            disabled={!user || !isBase}
                            ghost>
                            {t('post')}
                        </Button>
                        {errorMsg}
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['classes', 'general'])(SkillShareMenu)
)
