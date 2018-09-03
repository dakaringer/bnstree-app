import React from 'react'
import {connect} from 'react-redux'
import {Map, fromJS} from 'immutable'

import SkillItem from './SkillListItem'
import {stringParser} from '../parser'

import {
    filteredSkillListSelector,
    uiTextSelector,
    orderSelector
} from '../selector'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SKILL_LIST', Map()),
        skillList: filteredSkillListSelector(state),
        order: orderSelector(state)
    }
}

const SkillList = (props) => {
    let list = []
    let hotkeyBar = []

    props.skillList.forEach((v, k) => {
        let skills = []
        v.forEach((s, id) => {
            skills.push(<SkillItem key={id} skill={s} skillId={id}/>)
        })

        let key = props.uiText.getIn(['hotkeys', k])
        let label = key
        if (props.order == 'LEVEL') {
            key = k
            label = stringParser(fromJS({template: 'level', variables: {level: k}}), props.uiText)
        }

        list.push(
            <div key={k} id={`keyGroup_${k}`} className='group'>
                <h4 className='groupLabel'>{label}</h4>
                {skills}
            </div>
        )

        hotkeyBar.push(
            <a href='#' key={k} onClick={(e) => jump(k, e)}>{key}</a>
        )
    })

    return (
        <div className='skillList2'>
            <div className='list'>
                {list}
            </div>
            <div className='hotkeyBar'>
                {hotkeyBar}
            </div>
        </div>
    )
}

function jump(key, e) {
    e.preventDefault()
    var element = document.getElementById(`keyGroup_${key}`)
    element.parentNode.scrollTop = element.offsetTop
}

export default connect(mapStateToProps)(SkillList)
