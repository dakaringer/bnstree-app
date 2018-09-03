import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {Modal, Row, Col, Tooltip} from 'antd'

import {
    filteredListDataSelector,
    levelSelector,
    maxPointsSelector,
    usedPointsSelector,
    uiTextSelector,
    buildSelector
} from '../selector'
import {selectSkill} from '../actions'
import overlays from './overlayImg'
import elementImages from './elementImg'

import SkillTree from './SkillTree'
import TreeTagList from './TreeTagList'
import SkillTooltip from './SkillTooltip'

const mapStateToProps = (state) => {
    return {
        list: filteredListDataSelector(state),
        currentLevel: levelSelector(state).level,
        remainingPoints: maxPointsSelector(state) - usedPointsSelector(state),
        uiText: uiTextSelector(state).get('SKILL_LIST', Map()),
        build: buildSelector(state)
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        select: (id) => dispatch(selectSkill(id))
    }
}

class SkillGrid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false
        }
    }

    close() {
        this.setState({modal: false})
    }

    open(id) {
        this.props.select(id)
        this.setState({modal: true})
    }

    render() {
        let topLeft = []
        let topMiddle = []
        let topRight = []
        let bottomLeft = []
        let bottomMiddle = []
        let bottomRight = []

        this.props.list.forEach((group, k) => {
            let groupSkills = []
            group.forEach((skill, id) => {
                let treeId = skill.get('treeId')
                let minLevel = skill.get('minLevel')
                let className = 'gridSkill'

                className += treeId
                    ? ' tree'
                    : ''

                className += minLevel > this.props.currentLevel || skill.get('disabled')
                    ? ' disabled'
                    : ''

                let overlay = null
                if (treeId && this.props.remainingPoints > 0 && !skill.get('filled')) {
                    overlay = <img className='overlay' src={overlays.plus}/>
                }

                if (minLevel > this.props.currentLevel) {
                    overlay = <img className='overlay' src={overlays.lock}/>
                }

                let pointsOverlay = null
                if (treeId) {
                    pointsOverlay = <span className='pointsOverlay'>{skill.get('usedPoints')}</span>
                }

                let elements = skill.get('elements', []).map((e) => <img key={`${e}`} className='element' src={elementImages[e]}/>)

                groupSkills.push(
                    <div className={className} key={id} onMouseOver={() => this.props.select(id)} onClick={() => this.open(id)} data-tip data-for={id}>
                        <Tooltip placement='right' title={<SkillTooltip/>} align={{overflow: {adjustY: false, adjustX: true}}} mouseLeaveDelay={0} overlayClassName='gridTooltip'>
                            <div className='imgContainer'>
                                {overlay}
                                {pointsOverlay}
                                <img className='gridIcon' src={`/images/skill/${skill.get('icon')}.png`}/>
                                <span className='elements'>{elements}</span>
                            </div>
                            <p className='gridSkillName'>{skill.get('name')}</p>
                        </Tooltip>
                    </div>
                )
            })
            let hotkey = this.props.uiText.getIn([
                'hotkeys', k
            ], '')

            let keyGroup = <div key={k} className={`group width_${Math.ceil(groupSkills.length / 4)}`}>
                <div className='grid'>
                    {groupSkills}
                </div>
                <h5 className='groupHeader'>{hotkey}</h5>
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
                    bottomMiddle.push(keyGroup)
                    break
                default:
                    bottomRight.push(keyGroup)
            }
        })

        let gridModal =
            <Modal visible={this.state.modal} title={null} footer={null} onCancel={() => this.close()} className='gridModal'>
                <div className='gridModalBody'>
                    <Row gutter={20}>
                        <Col xs={12} className='treeContainer'>
                            <SkillTree/>
                            <TreeTagList/>
                        </Col>
                        <Col xs={12} className='tooltipContainer'>
                            <SkillTooltip/>
                        </Col>
                    </Row>
                </div>
            </Modal>

        return (
            <div className='skillGrid'>
                <table>
                    <tbody>
                        <tr className='top'>
                            <td>
                                <div className='block primary'>{topLeft}</div>
                            </td>
                            <td>
                                <div className='block'>{topMiddle}</div>
                            </td>
                            <td>
                                <div className='block'>{topRight}</div>
                            </td>
                        </tr>
                        <tr className='bottom'>
                            <td>
                                <div className='block primary'>{bottomLeft}</div>
                            </td>
                            <td>
                                <div className='block'>{bottomMiddle}</div>
                            </td>
                            <td>
                                <div className='block'>{bottomRight}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {gridModal}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillGrid)
