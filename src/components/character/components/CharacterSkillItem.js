import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'
import {Tooltip} from 'antd'

import SkillTooltip from './CharacterSkillTooltip'

import {
    classSkillDataSelector
} from '../selector'

import keyImages from '../../trainer2/images/map_keyImg'
import typeImages from '../../trainer2/images/map_typeImg'

import {
    uiTextSelector,
    constantSelector
} from '../../trainer2/selector'
import {learnType} from '../actions'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SKILL_LIST', Map()),
        constants: constantSelector(state),
        currentElement: classSkillDataSelector(state).element
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        learnType: (skill, type) => dispatch(learnType(skill, type))
    }
}

const SkillListItem = (props) => {
    let types = []
    let currentType = props.skill.get('variationIndex', '11')[1] - 1
    let currentTooltip = <SkillTooltip variationIndex={props.skill.get('variationIndex', '11')} skillId={props.skillId} skill={props.skill} />

    props.skill.get('types').forEach((t, i) => {
        let hmButton = null
        let hmTooltip = null
        let hmActive = false

        if (t.get('hmTraits')) {
            hmActive = props.skill.get('variationIndex', '11')[0] >=5 && currentType == i

            hmTooltip = <SkillTooltip variationIndex={`5${i+1}`} skillId={props.skillId} skill={props.skill} />
            hmButton = <Tooltip placement="bottomLeft" align={{overflow: {adjustY: false, adjustX: true}}} title={hmTooltip} mouseLeaveDelay={0} overlayClassName='skillTooltipWrap'>
                <div className={`hmButton ${hmActive ? 'active' : ''}`}></div>
            </Tooltip>
        }
        let tooltip = <SkillTooltip variationIndex={hmActive ? `5${i+1}` : `1${i+1}`} skillId={props.skillId} skill={props.skill} />

        let classification = t.get('classification')
        if (Map.isMap(classification)) {
            classification = classification.get(props.currentElement)
        }

        let typeIcon = props.constants.getIn(['TYPES', classification, 'icon'])
        if (!typeIcon) {
            typeIcon = 't33'
        }

        types.push(
            <div key={i} className={`buttonWrap ${currentType == i ? 'active' : ''}`}>
                <div className='innerWrap'>
                    <Tooltip placement="bottomLeft" title={tooltip} align={{overflow: {adjustY: false, adjustX: true}}} mouseLeaveDelay={0} overlayClassName='skillTooltipWrap'>
                        <div className='typeButton'>
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
    if (props.skill.get('hotkey') != 'None') {
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
