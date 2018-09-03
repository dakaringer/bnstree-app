import React from 'react'
import {connect} from 'react-redux'
import {Map, fromJS} from 'immutable'

import {Checkbox} from 'antd'

import elementImages from '../../shared/images/map_elementImg'

import SkillItem from './CharacterSkillItem'
import {toggleVisibility} from '../actions'
import {visibilitySelector} from '../selector'

import {stringParser} from '../../trainer2/parser'
import {constantSelector} from '../../trainer2/selector'
import {currentLanguageSelector} from '../../../selector'

import {
    uiTextSelector,
    classSkillDataSelector
} from '../selector'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SKILL_LIST', Map()),
        currentLanguage: currentLanguageSelector(state),
        constants: constantSelector(state),
        skillData: classSkillDataSelector(state),
        visibility: visibilitySelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleVisibility: () => dispatch(toggleVisibility())
    }
}

const CharacterSkills = (props) => {
    let list = []
    props.skillData.list.forEach((group, level) => {
        let skills = []
        group.forEach((skill, id) => {
            skills.push(<SkillItem key={id} skill={skill} skillId={id}/>)
        })

        let label = stringParser(fromJS({template: 'level', variables: {level: level}}), props.uiText)

        list.push(
            <div key={level} id={`keyGroup_${level}`} className='group'>
                <h4 className='groupLabel'>{label}</h4>
                {skills}
            </div>
        )
    })

    return (
        <div className='characterSkills skillList2'>
            <div className={`buildInfo ${props.skillData.element}`}>
                <h4>
                    {props.constants.getIn(['ELEMENT', props.skillData.element], '')}
                    <img className='buildElement' src={elementImages[props.skillData.element]}/>
                </h4>
                <div className='visibilityFilter'>
                    <Checkbox defaultChecked={false} size="small" onChange={props.toggleVisibility} checked={props.visibility}>
                        {props.uiText.get('showAll', '')}
                    </Checkbox>
                </div>
            </div>
            <div className='list'>
                {list}
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterSkills)
