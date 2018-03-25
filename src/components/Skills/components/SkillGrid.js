import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import SkillGridItem from './SkillGridItem'

import { catagorizedSkillDataSelector } from '../selectors'

const mapStateToProps = state => {
    return {
        skillData: catagorizedSkillDataSelector(state)
    }
}

const SkillGrid = props => {
    const { t, skillData } = props

    let topLeft = []
    let topMiddle = []
    let topRight = []
    let bottomLeft = []
    let bottomMiddle = []
    let bottomRight = []

    skillData.forEach((section, k) => {
        let skills = []
        section.forEach((skill, id) => {
            skills.push(<SkillGridItem skillData={skill} skillId={id} key={id} />)
        })

        let label = t(k)
        let keyGroup = (
            <div key={k} className={`group width_${Math.ceil(skills.length / 4)}`}>
                <div className="grid">{skills}</div>
                <h5 className="groupHeader">{label}</h5>
            </div>
        )

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
                bottomMiddle.push(keyGroup)
                break
            case 'G':
            case 'B':
                bottomRight.push(keyGroup)
                break
            default:
                topRight.push(keyGroup)
        }
    })

    return (
        <div className="skill-grid">
            <table>
                <tbody>
                    <tr className="top">
                        <td className="primary">
                            <div className="block">{topLeft}</div>
                        </td>
                        <td className="secondary">
                            <div className="secondaryContainer">
                                <div className="block">{topMiddle}</div>
                                <div className="block">{topRight}</div>
                            </div>
                        </td>
                    </tr>
                    <tr className="bottom">
                        <td className="primary">
                            <div className="block">{bottomLeft}</div>
                        </td>
                        <td className="secondary">
                            <div className="secondaryContainer">
                                <div className="block">{bottomMiddle}</div>
                                <div className="block">{bottomRight}</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default connect(mapStateToProps)(translate(['classes', 'tooltip'])(SkillGrid))
