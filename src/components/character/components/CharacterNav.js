import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'
import { withRouter } from 'react-router'

import {
    uiTextSelector,
    regionSelector,
    characterSelector
} from '../selector'
import {userSelector} from '../../../selector'

import {Icon, Radio, Modal} from 'antd'
const RadioGroup = Radio.Group

import icon from '../images/GameUI_HeaderIcon_160.png'

const mapStateToProps = (state) => {
    let uiText = uiTextSelector(state)
    return {
        classNames: uiText.get('CLASS_NAMES', Map()),
        uiText: uiText.get('CHARACTER_NAV', Map()),
        user: userSelector(state),
        region: regionSelector(state),
        character: characterSelector(state).get('general', Map())
    }
}

class CharacterNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: {
                share: false
            },
            link: null,
            region: 'na',
            characterName: ''
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
                link: ''
            })

            this.generateLink()
        }

        let modal = this.state.modal
        modal[type] = true
        this.setState({modal: modal})
    }

    select(e) {
        e.target.select()
    }

    changeRegion(e) {
        this.setState({region: e.target.value})
    }

    enterCharacter(e) {
        this.setState({characterName: e.target.value})
    }

    searchCharacter(e) {
        e.preventDefault()
        this.props.history.push(`/character/${this.state.region}/${this.state.characterName}`)
    }

    generateLink() {
        if (this.props.character.equals(Map())) {
            this.setState({link: `${this.props.region}/?c=`})
        }
        else {
            this.setState({link: `${this.props.region}/${this.props.character.get('name')}`})
        }
    }

    render() {
        let navSearch =
            <div className="navSearch">
                <form  onSubmit={(e) => this.searchCharacter(e)}>
                    <RadioGroup onChange={(e) => this.changeRegion(e)} value={this.state.region}>
                        <Radio key="a" value={'na'}>NA</Radio>
                        <Radio key="b" value={'eu'}>EU</Radio>
                    </RadioGroup>
                    <div className='inputGroup'>
                        <input onChange={(e) => this.enterCharacter(e)} value={this.state.characterName} className="nameInput" placeholder={this.props.uiText.get('characterSearch', '')}/>
                    </div>
                </form>
            </div>

        let menu = null

        /*
        <span className='nav-menu-item'>
            <a className='like disabled' onClick={() => {}} disabled>
                <Icon type="heart-o"/> {this.props.uiText.get('like')}
            </a>
        </span>
        */

        if (!this.props.character.equals(Map())) {
            menu = <span>
                <span className='nav-menu-item'>
                    <a className='share' onClick={() => this.open('share')}>
                        <Icon type="share-alt"/> {this.props.uiText.get('share')}
                    </a>
                </span>
            </span>
        }

        return (
            <div>
                <div className='character-nav sub-nav'>
                    <span className='nav-header'>
                        <img src={icon}/>
                        <span>{this.props.uiText.get('characterSearch', '')}</span>
                    </span>
                    <span className='nav-search-container'>
                        {navSearch}
                    </span>
                    <span className='nav-right'>
                        <span className='nav-menu'>
                            {menu}
                        </span>
                    </span>
                </div>
                <Modal visible={this.state.modal.share} title={this.props.uiText.get('share')} footer={null} className='shareModal' onCancel={() => this.close('share')}>
                    <div>
                        <label>{this.props.uiText.get('shareLink')}</label>
                        <input readOnly value={encodeURI(`${window.location.protocol}//${window.location.host}/character/${this.state.link}`)} onClick={this.select}/>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps)(CharacterNav))
