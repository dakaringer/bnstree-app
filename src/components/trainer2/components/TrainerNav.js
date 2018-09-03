import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {
    uiTextSelector,
    classSelector,
    statSelector,
    tabSelector,
    buildFormatSelector,
    classElementSelector
} from '../selector'
import {userSelector} from '../../../selector'
import {
    setStat,
    setElementStat,
    blurStat,
    blurElement,
    postBuild
} from '../actions'

import {Button, Icon, Radio, message, Modal, Row, Col} from 'antd'
const RadioGroup = Radio.Group

import elementImages from '../../shared/images/map_elementImg'
import classImages from '../../shared/images/map_classImg'

const mapStateToProps = (state) => {
    let currentClass = classSelector(state)
    let uiText = uiTextSelector(state)
    return {
        classCode: currentClass,
        className: uiText.getIn([
            'CLASS_NAMES', currentClass
        ], null),
        uiText: uiText.get('SKILL_TRAINER_NAV', Map()),
        stats: statSelector(state),
        tab: tabSelector(state),
        user: userSelector(state),
        buildFormat: buildFormatSelector(state),
        classElements: classElementSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setStat: (e, type) => dispatch(setStat(e.target.value, type)),
        setElementStat: (e, type) => dispatch(setElementStat(e.target.value, type)),
        blurStat: (e, type) => dispatch(blurStat(e.target.value, type)),
        blurElement: (e, type) => dispatch(blurElement(e.target.value, type)),
        postBuild: (title, type) => dispatch(postBuild(title, type))
    }
}

class TrainerNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: {
                stat: false,
                share: false
            },
            link: null,
            title: '',
            type: 'PvE',
            error: false
        }
    }

    close(type) {
        let modal = this.state.modal
        modal[type] = false
        this.setState({modal: modal})
    }

    open(type) {
        if (type == 'share') {
            this.setState({
                link: '',
                currentTabOnly: false
            })

            this.generateLink()
        }

        let modal = this.state.modal
        modal[type] = true
        this.setState({
            modal: modal
        })
    }

    blurInput(e) {
        if (e.key === 'Enter') {
            e.target.blur()
        }
    }

    select(e) {
        e.target.select()
    }

    changeType(e) {
        this.setState({type: e.target.value})
    }

    changeTitle(e) {
        this.setState({title: e.target.value})
    }

    postBuild() {
        if (this.state.title.trim() === '') {
            this.setState({error: true})
        }
        else {
            this.props.postBuild(this.state.title, this.state.type)
            this.setState({
                modal: {
                    stat: false,
                    share: false
                },
                title: '',
                type: 'PvE',
                error: false
            })

            message.success(this.props.uiText.get('posted'), 2)
        }
    }

    generateLink() {
        let element = this.props.tab.get('element')
        let build = this.props.tab.getIn(['build', element], Map())
        let elementIndex = this.props.classElements.findIndex(a => a.get('element') == element)

        let buildString = ''
        this.props.buildFormat.forEach(id => {
            let trait = build.get(id, '0')
            buildString += parseInt(trait) + (trait.length == 1 ? 1 : 4)
        })
        this.setState({link: elementIndex + buildString})
    }

    render() {
        let statInputs = []
        for (let s of ['ap', 'petAp', 'ad', 'c']) {
            if (s != 'petAp' || ['SU', 'WL'].indexOf(this.props.classCode) > -1) {
                statInputs.push(
                    <div key={s}>
                        <label>{this.props.uiText.get(s)}</label>
                        <input onChange={(e) => this.props.setStat(e, s)} onBlur={(e) => this.props.blurStat(e, s)} onKeyPress={(e) => this.blurInput(e)} value={this.props.stats.get(s) === null
                            ? ''
                        : this.props.stats.get(s)}/>
                    </div>
                )
            }
        }

        let elementInputs = []
        for (let element of ['flame', 'frost', 'lightning', 'shadow', 'wind', 'earth']) {
            elementInputs.push(
                <div key={element}>
                    <div>
                        <label><span><img src={elementImages[element]}/> {this.props.uiText.get(element)}%</span></label>
                        <input onChange={(e) => this.props.setElementStat(e, element)} onBlur={(e) => this.props.blurElement(e, element)} onKeyPress={(e) => this.blurInput(e)} value={this.props.stats.getIn(['element', element]) === null
                            ? ''
                            : this.props.stats.getIn(['element', element])}/>
                    </div>
                </div>
            )
        }

        let disabled = !this.props.user ? true : false
        let placeholder = disabled ? this.props.uiText.get('loginRequired') : ''
        let error = this.state.error ? this.props.uiText.get('titleError') : ''

        return (
            <div>
                <div className='trainer-nav sub-nav'>
                    <span className='nav-header'>
                        <img src={classImages[this.props.classCode]}/>
                        <span>{this.props.className}</span>
                    </span>
                    <span className='nav-settings'>
                        <a className='advanced' onClick={() => this.open('stat')}>
                            <h5>{this.props.uiText.get('advanced')}<br/>
                                <small>{this.props.uiText.get('ap')} {this.props.stats.get('ap')}</small>
                            </h5>
                        </a>
                    </span>
                    <span className='nav-right'>
                        <span className='nav-menu'>
                            <span className='nav-menu-item'>
                                <a className='share' onClick={() => this.open('share')}>
                                    <Icon type="share-alt"/> {this.props.uiText.get('share')}
                                </a>
                            </span>
                        </span>
                    </span>
                </div>

                <Modal visible={this.state.modal.stat} title={null} footer={null} className='statModal' onCancel={() => this.close('stat')}>
                    <Row gutter={20}>
                        <Col sm={12}>
                            <h4>{this.props.uiText.get('advanced')}</h4>
                            {statInputs}
                            <p className='help'>{this.props.uiText.get('weaponConstantInfo')}</p>
                        </Col>
                        <Col sm={12}>
                            <h4>{this.props.uiText.get('elements')}</h4>
                            {elementInputs}
                        </Col>
                    </Row>
                </Modal>
                <Modal visible={this.state.modal.share} title={this.props.uiText.get('share')} footer={null} className='shareModal' onCancel={() => this.close('share')}>
                    <div>
                        <label>{this.props.uiText.get('shareLink')}</label>
                        <input readOnly value={`${window.location.protocol}//${window.location.host + window.location.pathname}?b=${this.state.link}`} onClick={this.select}/>
                    </div>
                    <div className={disabled ? 'disabled' : ''}>
                        <h5>{this.props.uiText.get('postOn')}</h5>
                        <label>{this.props.uiText.get('title')}</label>
                        <input placeholder={placeholder} value={this.state.title} onChange={(e) => this.changeTitle(e)} disabled={disabled}/>
                        <label>{this.props.uiText.get('type')}</label>
                        <RadioGroup onChange={(e) => this.changeType(e)} value={this.state.type} disabled={disabled}>
                            <Radio key="a" value={'PvE'}>PvE</Radio>
                            <Radio key="b" value={'PvP'}>PvP</Radio>
                            <Radio key="c" value={'6v6'}>6v6</Radio>
                        </RadioGroup>
                        <Button className='post' type='primary' ghost disabled={disabled} onClick={() => this.postBuild()}>
                            {this.props.uiText.get('post')}
                        </Button>
                        <p className='noTitle'>{error}</p>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainerNav)
