import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {
    uiTextSelector,
    equipDataSelector
} from '../selector'
import {userSelector} from '../../../selector'

import {Icon, Modal} from 'antd'

import icon from '../images/gather_carved_woodboard.png'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SS_MIXER_NAV', Map()),
        user: userSelector(state),
        equipData: equipDataSelector(state),
    }
}

class TrainerNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: {
                share: false
            },
            link: null
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

    generateLink() {
        let equipData = this.props.equipData.toJS()

        fetch('/api/mixer/generateLink', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({equipData: equipData})
        }).then(response => response.json()).then(json => {
            this.setState({
                link: json.link
            })
        })
    }

    render() {
        let menu = <span>
            <span className='nav-menu-item'>
                <a className='share' onClick={() => this.open('share')}>
                    <Icon type="share-alt"/> {this.props.uiText.get('share')}
                </a>
            </span>
        </span>

        return (
            <div>
                <div className='mixer-nav sub-nav'>
                    <span className='nav-header'>
                        <img src={icon}/>
                        <span>{this.props.uiText.get('title', '')}</span>
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
                        <input readOnly value={`${window.location.protocol}//${window.location.host + window.location.pathname}?b=${this.state.link}`} onClick={this.select}/>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps)(TrainerNav)
