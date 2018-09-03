import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {
    filteredListDataSelector,
    levelSelector,
    maxPointsSelector,
    usedPointsSelector,
    uiTextSelector
} from '../selector'
import {selectSkill} from '../actions'
import {stringParser} from '../calc'
import overlays from './overlayImg'
import elementImages from './elementImg'

const mapStateToProps = (state) => {
    return {
        list: filteredListDataSelector(state),
        currentLevel: levelSelector(state).level,
        remainingPoints: maxPointsSelector(state) - usedPointsSelector(state),
        uiText: uiTextSelector(state).get('SKILL_LIST', Map())
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        select: (id) => dispatch(selectSkill(id))
    }
}

class SkillList extends React.Component {
    jump(key, e) {
        e.preventDefault()
        var element = document.getElementById(`keyGroup_${key}`)
        element.parentNode.scrollTop = element.offsetTop
    }

    render() {
        let list = []
        let hotkeyBar = []

        this.props.list.forEach((group, k) => {
            let groupSkills = []
            group.forEach((skill, id) => {
                let treeId = skill.get('treeId')
                let minLevel = skill.get('minLevel')
                let className = 'listSkill'

                className += treeId
                    ? ' tree'
                    : ''

                className += skill.get('selected')
                    ? ' selected'
                    : ''

                className += minLevel > this.props.currentLevel || skill.get('disabled')
                    ? ' disabled'
                    : ''

                let overlay = null
                let subtitle = null
                if (treeId && this.props.remainingPoints > 0 && !skill.get('filled')) {
                    overlay = <img className='overlay' src={overlays.plus}/>
                }

                if (skill.get('status', '').length == 2 && !skill.get('disabled')) {
                    let node = skill.get('status')
                    let s = stringParser(this.props.uiText.get('tierStage', ''), Map({
                        tier: node[0],
                        stage: node[1]
                    }))
                    subtitle = <small>{s}</small>
                }

                if (minLevel > this.props.currentLevel) {
                    subtitle = <small className='levelReq'>{this.props.uiText.get('reqLevel', '')} {minLevel}</small>
                    overlay = <img className='overlay' src={overlays.lock}/>
                }

                let pointsOverlay = null
                if (treeId) {
                    pointsOverlay = <span className='pointsOverlay'>{skill.get('usedPoints')}</span>
                }

                let elements = skill.get('elements', []).map((e) => <img key={`${e}`} className='element' src={elementImages[e]}/>)

                groupSkills.push(
                    <li className={className} key={id} onClick={() => this.props.select(id)}>
                        <span className='imgContainer'>
                            {overlay}
                            {pointsOverlay}
                            <img className='icon' src={`/images/skill/${skill.get('icon')}.png`}/>
                        </span>
                        <span className='name'>{skill.get('name')}{subtitle}</span>
                        <span className='elements'>{elements}</span>
                    </li>
                )
            })
            let hotkey = this.props.uiText.getIn([
                'hotkeys', k
            ], '')

            hotkeyBar.push(
                <a href='#' key={k} onClick={(e) => this.jump(k, e)}>{hotkey}</a>
            )

            list.push(
                <li key={k} id={`keyGroup_${k}`}>
                    <h5 className='groupHeader'>{hotkey}</h5>
                    <ul>
                        {groupSkills}
                    </ul>
                </li>
            )
        })

        return (
            <div className='skillList'>
                <ul className='list'>
                    {list}
                </ul>
                <div className='hotkeyBar'>
                    {hotkeyBar}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillList)
