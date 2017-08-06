import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map} from 'immutable'

import {Icon, Modal, Button} from 'antd'
import {Radio, RadioGroup} from 'react-radio-group'

import {userSelector} from '../../../selectors'
import {buildElementSelector, buildSelector, elementDataSelector} from '../selectors'
import {postBuild} from '../actions'

function generateLink(element, build, elementData) {
    let elementIndex = elementData.findIndex(a => a.get('element') === element)
    let buildString = ''
    elementData.getIn([elementIndex, 'buildFormat'], Map()).forEach(id => {
        let trait = build.get(id, '1')
        buildString += parseInt(trait, 10)
    })
    return elementIndex + buildString
}

const mapStateToProps = state => {
    return {
        user: userSelector(state),
        element: buildElementSelector(state),
        buildData: buildSelector(state),
        elementData: elementDataSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        postBuild: (title, type, buildCode) => dispatch(postBuild(title, type, buildCode))
    }
}

class SkillShareMenu extends React.Component {
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
        this.setState({
            title: e.target.value
        })
    }

    post(buildCode) {
        let {title, type} = this.state

        if (title.trim() === '') {
            this.setState({
                noTitle: true
            })
        } else {
            this.props.postBuild(title, type, buildCode)

            this.setState({
                title: '',
                type: 'PvE',
                show: false,
                noTitle: false
            })
        }
    }

    render() {
        const {t, user, element, buildData, elementData} = this.props
        const {show, title, type, noTitle} = this.state

        let buildCode = generateLink(element, buildData, elementData)

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
                            <p>
                                {t('type')}
                            </p>
                            <RadioGroup
                                className="radio"
                                selectedValue={type}
                                onChange={value => this.setType(value)}>
                                <label>
                                    <Radio value="PvE" disabled={!user} />
                                    {t('PvE')}
                                </label>
                                <label>
                                    <Radio value="PvP" disabled={!user} />
                                    {t('PvP')}
                                </label>
                                <label>
                                    <Radio value="6v6" disabled={!user} />
                                    {t('6v6')}
                                </label>
                            </RadioGroup>
                        </div>
                        {noTitle
                            ? <p className="error">
                                  {t('noTitle')}
                              </p>
                            : null}
                        <Button
                            className="post"
                            type="primary"
                            onClick={() => this.post(buildCode)}
                            disabled={!user}
                            ghost>
                            {t('post')}
                        </Button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['skills', 'general'])(SkillShareMenu)
)
