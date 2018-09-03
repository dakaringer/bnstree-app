import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import SkillGridItem from './SkillGridItem'

import {
    filteredSkillListSelector,
    uiTextSelector
} from '../selector'

const mapStateToProps = (state) => {
    return {
        skillList: filteredSkillListSelector(state),
        uiText: uiTextSelector(state).get('SKILL_LIST', Map())
    }
}

const SkillGrid = (props) => {
    let topLeft = []
    let topMiddle = []
    let topRight = []
    let bottomLeft = []
    let bottomMiddle = []
    let bottomRight = []

    props.skillList.forEach((v, k) => {
        let skills = []
        v.forEach((skill, id) => {
            skills.push(<SkillGridItem key={id} skill={skill} skillId={id}/>)
        })

        let key = props.uiText.getIn(['hotkeys', k])

        let keyGroup = <div key={k} className={`group width_${Math.ceil(skills.length / 4)}`}>
            <div className='grid'>
                {skills}
            </div>
            <h5 className='groupHeader'>{key}</h5>
        </div>

        switch (k) {
            case 'Tab':
            case 'F':
                topLeft.push(keyGroup)
                break
            case '1':
            case '2':
            case '3':
            case '4':
                topMiddle.push(keyGroup)
                break
            case 'LB':
            case 'RB':
                topRight.push(keyGroup)
                break
            case 'Q':
            case 'E':
            case 'S':
                bottomLeft.push(keyGroup)
                break
            case 'Z':
            case 'X':
            case 'C':
            case 'V':
            case 'G':
            case 'B':
                bottomMiddle.push(keyGroup)
                break
            default:
                topRight.push(keyGroup)
        }
    })

    return (
        <div className='skillGrid'>
            <table>
                <tbody>
                    <tr className='top'>
                        <td className='primary'>
                            <div className='block'>{topLeft}</div>
                        </td>
                        <td className='secondary'>
                            <div className='secondaryContainer'>
                                <div className='block'>{topMiddle}</div>
                                <div className='block'>{topRight}</div>
                            </div>
                        </td>
                    </tr>
                    <tr className='bottom'>
                        <td className='primary'>
                            <div className='block'>{bottomLeft}</div>
                        </td>
                        <td className='secondary'>
                            <div className='secondaryContainer'>
                                <div className='block'>{bottomMiddle}</div>
                                <div className='block'>{bottomRight}</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default connect(mapStateToProps)(SkillGrid)
