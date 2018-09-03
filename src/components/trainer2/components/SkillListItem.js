import React from 'react'
import {connect} from 'react-redux'
import {Map, List} from 'immutable'
import {Tooltip} from 'antd'

import SkillTooltip from './SkillTooltip'

import keyImages from '../images/map_keyImg'
import typeImages from '../images/map_typeImg'

import {
    uiTextSelector,
    constantSelector,
    buildSelector,
    filterSelector,
    currentElementSelector,
    orderSelector
} from '../selector'
import {learnType} from '../actions'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SKILL_LIST', Map()),
        constants: constantSelector(state),
        build: buildSelector(state),
        currentFilter: filterSelector(state),
        currentElement: currentElementSelector(state),
        order: orderSelector(state)
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        learnType: (skill, type) => dispatch(learnType(skill, type))
    }
}

const SkillListItem = (props) => {
    let types = []
    let currentType = props.build.get(props.skillId, '0')
    let currentTooltip = <SkillTooltip tooltipData={props.skill.get('types')} type={currentType} skillId={props.skillId}/>

    props.skill.get('types').forEach((t, i) => {
        let hmButton = null
        let hmTooltip = null
        let hmActive = false

        if (t.get('hmTraits')) {
            hmActive = currentType == i + '-hm'

            hmTooltip = <SkillTooltip tooltipData={props.skill.get('types')} type={`${i}-hm`} skillId={props.skillId}/>
            hmButton = <Tooltip placement="bottomLeft" align={{overflow: {adjustY: false, adjustX: true}}} title={hmTooltip} mouseLeaveDelay={0} overlayClassName='skillTooltipWrap'>
                <div className={`hmButton ${hmActive ? 'active' : ''}`} onClick={() => props.learnType(props.skillId, hmActive ? `${i}` : `${i}-hm`)}></div>
            </Tooltip>
        }

        let tooltip = <SkillTooltip tooltipData={props.skill.get('types')} type={hmActive ? `${i}-hm` : `${i}`} skillId={props.skillId}/>

        let filterList = t.get('filter', List())
        if (Map.isMap(filterList)) {
            filterList = filterList.get(props.currentElement, List())
        }

        let classification = t.get('classification')
        if (Map.isMap(classification)) {
            classification = classification.get(props.currentElement)
        }

        let typeIcon = props.constants.getIn(['TYPES', classification, 'icon'])
        if (!typeIcon) {
            typeIcon = 't33'
        }

        types.push(
            <div key={i} className={`buttonWrap ${currentType.charAt(0) == i ? 'active' : ''}`}>
                <div className={`innerWrap ${filterList.includes(props.currentFilter) ? 'glow' : ''}`}>
                    <Tooltip placement="bottomLeft" title={tooltip} align={{overflow: {adjustY: false, adjustX: true}}} mouseLeaveDelay={0} overlayClassName='skillTooltipWrap'>
                        <div className='typeButton' onClick={() => props.learnType(props.skillId, hmActive ? `${i}-hm` : `${i}`)}>
                            <h6>{props.constants.getIn(['TYPES', classification, 'text'])}</h6>
                            <div className="typeImg"><img src={typeImages[typeIcon]}/></div>
                        </div>
                    </Tooltip>
                    {hmButton}
                </div>
            </div>
        )
    })

    let key = null
    if (props.order == 'LEVEL' && props.skill.get('hotkey') != 'None') {
        key = <img className='key' src={keyImages[props.skill.get('hotkey')]}/>
    }

    return (
        <div className='skillItem'>
            <Tooltip placement="bottomLeft" title={currentTooltip} align={{overflow: {adjustY: false, adjustX: true}}} overlayClassName='skillTooltipWrap'>
                <img className='icon' src={`/images/skill/${props.skill.get('icon')}.png`}/>
            </Tooltip>
            <div>
                <h4 className='skillName'>{props.skill.get('name')} {key}</h4>
                <div className={`types ${types.length == 1 ? 'single' : ''}`}>
                    {types}
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillListItem)
