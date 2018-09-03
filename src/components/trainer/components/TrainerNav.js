import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {
    uiTextSelector,
    levelSelector,
    usedPointsSelector,
    maxPointsSelector,
    jobSelector,
    modeSelector,
    statSelector,
    buildsSelector,
    tabSelector
} from '../selector'
import {userSelector} from '../../../selector'
import {
    viewModes,
    setViewMode,
    setLevels,
    setHLevels,
    setStat,
    setElement,
    formatStat,
    formatElement,
    loadBuildList
} from '../actions'

import {Alert, Button, Icon, Modal, Popover, Row, Col} from 'antd'

import pointIcon from '../images/points.png'

import elementImages from './elementImg'
import classImages from './classImg'

const mapStateToProps = (state) => {
    let currentJob = jobSelector(state)
    let uiText = uiTextSelector(state)
    return {
        job: currentJob,
        jobName: uiText.getIn([
            'JOB_NAMES', currentJob
        ], null),
        uiText: uiText.get('TRAINER_NAV', Map()),
        levels: levelSelector(state),
        usedPoints: usedPointsSelector(state),
        maxPoints: maxPointsSelector(state),
        mode: modeSelector(state),
        stats: statSelector(state),
        builds: buildsSelector(state),
        tab: tabSelector(state),
        user: userSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setMode: (mode) => dispatch(setViewMode(mode)),
        setLevel: (level) => dispatch(setLevels(level)),
        setHLevel: (hLevel) => dispatch(setHLevels(hLevel)),
        setStat: (e, type) => dispatch(setStat(e.target.value, type)),
        setElement: (e, type) => dispatch(setElement(e.target.value, type)),
        formatStat: (e, type) => dispatch(formatStat(e.target.value, type)),
        formatElement: (e, type) => dispatch(formatElement(e.target.value, type)),
        loadBuildList: (job, page) => dispatch(loadBuildList(job, page))
    }
}

class TrainerNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: {
                level: false,
                stat: false,
                share: false
            },
            link: null,
            title: '',
            titleError: '',
            posted: false
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
        this.setState({modal: modal})
    }

    blurInput(e) {
        if (e.key === 'Enter') {
            e.target.blur()
        }
    }

    setTitle(e) {
        this.setState({
            title: e.target.value,
            titleError: ''
        })
    }

    select(e) {
        e.target.select()
    }

    generateLink() {
        let builds = this.props.builds.toJS()

        fetch('/api/trainer/generateLink', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({build: builds, job: this.props.job})
        }).then(response => response.json()).then(json => {
            this.setState({
                posted: false,
                link: json.link
            })
        })
    }

    postBuild() {
        if (this.state.link) {
            if (this.state.title.trim() != '') {
                fetch('/api/trainer/postBuild', {
                    method: 'post',
                    credentials: 'include',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({title: this.state.title, link: this.state.link})
                }).then(response => response.json()).then(json => {
                    if (json.result == 1) {
                        this.setState({
                            posted: true,
                            title: ''
                        })
                        this.props.loadBuildList(this.props.job, 1)
                    }
                })
            }
            else {
                this.setState({
                    titleError: this.props.uiText.get('titleError')
                })
            }
        }
    }

    render() {
        let levelGrid = []
        for (let i = 1; i <= 50; i++) {
            levelGrid.push(
                <span key={i} className={i == this.props.levels.level
                    ? 'active'
                : ''}>
                    <Button onClick={() => this.props.setLevel(i)} ghost>{i}</Button>
                </span>
            )
        }

        let hLevelGrid = []
        for (let i = 1; i <= 20; i++) {
            hLevelGrid.push(
                <span key={i} className={i == this.props.levels.hLevel
                    ? 'active'
                : ''}>
                    <Button onClick={() => this.props.setHLevel(i)} ghost disabled={this.props.levels.level != 50}>{i}</Button>
                </span>
            )
        }

        let statInputs = []
        for (let s of ['ap', 'ad', 'c']) {
            statInputs.push(
                <div key={s}>
                    <label>{this.props.uiText.get(s)}</label>
                    <input onChange={(e) => this.props.setStat(e, s)} onBlur={(e) => this.props.formatStat(e, s)} onKeyPress={(e) => this.blurInput(e)} value={this.props.stats.get(s) === null
                        ? ''
                    : this.props.stats.get(s)}/>
                </div>
            )
        }

        let elementInputs = []
        for (let element of ['flame', 'frost', 'lightning', 'shadow', 'wind', 'earth']) {
            elementInputs.push(
                <div key={element}>
                    <div>
                        <label><span><img src={elementImages[element]}/> {this.props.uiText.get(element)}%</span></label>
                        <input onChange={(e) => this.props.setElement(e, element)} onBlur={(e) => this.props.formatElement(e, element)} onKeyPress={(e) => this.blurInput(e)} value={this.props.stats.getIn(['element', element]) === null
                            ? ''
                        : this.props.stats.getIn(['element', element])}/>
                    </div>
                </div>
            )
        }

        let postOnSite = null
        if (this.props.user) {
            if (this.state.posted) {
                postOnSite = <Alert message={this.props.uiText.get('posted')} type="success" showIcon />
            }
            else {
                postOnSite =
                    <div>
                        <h4>{this.props.uiText.get('postOn')}</h4>
                        <label>{this.props.uiText.get('title')}</label>
                        <input value={this.state.title} onChange={(e) => this.setTitle(e)}/>
                        <Button onClick={() => this.postBuild()} bsStyle='info'>{this.props.uiText.get('post')}</Button>
                        <p>{this.state.titleError}</p>
                    </div>
            }
        }

        let menu = <span>
            <span className='nav-menu-item'>
                <a className={`modeToggle ${this.props.mode == viewModes.SHOW_LIST ? 'active' : ''}`} onClick={() => this.props.setMode(viewModes.SHOW_LIST)}>
                    <Icon type="bars"/> {this.props.uiText.get('modeList')}
                </a>
            </span>
            <span className='nav-menu-item'>
                <a className={`modeToggle ${this.props.mode == viewModes.SHOW_GRID ? 'active' : ''}`} onClick={() => this.props.setMode(viewModes.SHOW_GRID)}>
                    <Icon type="appstore-o"/> {this.props.uiText.get('modeIcon')}
                </a>
            </span>
            <span className='nav-menu-item'>
                <a className='share' onClick={() => this.open('share')}>
                    <Icon type="share-alt"/> {this.props.uiText.get('share')}
                </a>
            </span>
        </span>

        return (
            <div>
                <div className='trainer-nav'>
                    <span className='nav-header'>
                        <img src={classImages[this.props.job]}/>
                        <span>{this.props.jobName}</span>
                    </span>
                    <span className='points'>
                        <img src={pointIcon}/>
                        <div className='point-desc'>
                            <h5>{this.props.maxPoints - this.props.usedPoints}<br/>
                                <small>{this.props.usedPoints}/{this.props.maxPoints} {this.props.uiText.get('pointsUsed')}</small>
                            </h5>
                        </div>
                    </span>
                    <span className='nav-settings'>
                        <a className='level' onClick={() => this.open('level')}>
                            <h6>{this.props.uiText.get('level')}
                                <span>{this.props.levels.level}</span>
                            </h6>
                            <h6>{this.props.uiText.get('hLevel')}
                                <span>{this.props.levels.hLevel}{this.props.uiText.get('star')}</span>
                            </h6>
                        </a>
                        <a className='advanced' onClick={() => this.open('stat')}>
                            <h5>{this.props.uiText.get('advanced')}<br/>
                                <small>{this.props.uiText.get('ap')} {this.props.stats.get('ap')}</small>
                            </h5>
                        </a>
                    </span>
                    <span className='nav-right'>
                        <span className='nav-toggle'>
                            <Popover content={menu} overlayClassName='nav-popover' placement="bottomRight" trigger="click">
                                <Icon type="ellipsis" />
                            </Popover>
                        </span>
                        <span className='nav-menu'>
                            {menu}
                        </span>
                    </span>
                </div>

                <Modal visible={this.state.modal.level} title={null} footer={null} className='levelModal' onCancel={() => this.close('level')}>
                    <div>
                        <Row>
                            <Col sm={12}>
                                <h4>{this.props.uiText.get('level')}</h4>
                                <div className='levelGrid'>
                                    {levelGrid}
                                </div>
                            </Col>
                            <Col sm={12}>
                                <h4>{this.props.uiText.get('hLevel')}</h4>
                                <div className='levelGrid'>
                                    {hLevelGrid}
                                </div>
                            </Col>
                        </Row>
                        <p className='warning'>{this.props.uiText.get('levelWarning')}</p>
                    </div>
                </Modal>
                <Modal visible={this.state.modal.stat} title={null} footer={null} className='statModal' onCancel={() => this.close('stat')}>
                    <div>
                        <Row>
                            <Col sm={12}>
                                <h4>{this.props.uiText.get('advanced')}</h4>
                                {statInputs}
                                <p className='help'><small>{this.props.uiText.get('weaponConstantInfo')}</small></p>
                            </Col>
                            <Col sm={12}>
                                <h4>{this.props.uiText.get('elements')}</h4>
                                {elementInputs}
                            </Col>
                        </Row>
                    </div>
                </Modal>
                <Modal visible={this.state.modal.share} title={this.props.uiText.get('share')} footer={null} className='shareModal' onCancel={() => this.close('share')}>
                    <div>
                        <div>
                            <label>{this.props.uiText.get('shareLink')}</label>
                            <input readOnly value={`${window.location.protocol}//${window.location.host + window.location.pathname}?b=${this.state.link}`} onClick={this.select}/>
                        </div>
                        {postOnSite}
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainerNav)
