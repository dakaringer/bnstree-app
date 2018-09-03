import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {
    uiTextSelector
} from '../selector'

import icon from '../images/GameUI_HeaderIcon_02_10.png'

const mapStateToProps = (state) => {
    let uiText = uiTextSelector(state)
    return {
        uiText: uiText.get('RANKINGS', Map())
    }
}

const RankingNav = (props) => {
    return (
        <div>
            <div className='character-nav sub-nav'>
                <span className='nav-header'>
                    <img src={icon}/>
                    <span>{props.uiText.get('rankings', '')}</span>
                </span>
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(RankingNav)
