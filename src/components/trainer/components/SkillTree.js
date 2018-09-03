import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {
    levelSelector,
    nodesSelector,
    learnedSelector,
    treeStatusSelector,
    uiTextSelector,
    maxPointsSelector,
    usedPointsSelector,
    usedPointsSkillSelector,
    minLevelSelector,
    sharedTreeSelector
} from '../selector'
import {learnNode, learnTreeNode, unlearnNode, unlearnTreeNode, hoverNode} from '../actions'
import {stringParser, calculateUsedPointsSkill} from '../calc'
import overlays from './overlayImg'
import border from '../images/elite_border.png'

import {Icon} from 'antd'

const mapStateToProps = (state) => {
    let level = levelSelector(state).level
    return {
        sharedTree: sharedTreeSelector(state),
        nodes: nodesSelector(state),
        learned: learnedSelector(state),
        status: treeStatusSelector(state),
        uiText: uiTextSelector(state).get('SKILL_TREE', Map()),
        maxPoints: maxPointsSelector(state),
        usedPointsWithoutSkill: usedPointsSelector(state) - usedPointsSkillSelector(state),
        levelCond: minLevelSelector(state) <= level && level >= 15
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        learn: (node, learnable, sharedTree) => {
            if (learnable) {
                if (sharedTree) {
                    dispatch(learnTreeNode(sharedTree, node))
                }
                else {
                    dispatch(learnNode(node))
                }
            }
        },
        unlearn: (e, node, learned, sharedTree) => {
            e.preventDefault()
            if (learned) {
                if (sharedTree) {
                    dispatch(unlearnTreeNode(sharedTree, node))
                }
                else {
                    dispatch(unlearnNode(node))
                }
            }
        },
        touch: (e, node, learnable, learned, sharedTree) => {
            e.preventDefault()
            dispatch(hoverNode(null))
            if (learned) {
                if (sharedTree) {
                    dispatch(unlearnTreeNode(sharedTree, node))
                }
                else {
                    dispatch(unlearnNode(node))
                }
            } else if (learnable) {
                if (sharedTree) {
                    dispatch(learnTreeNode(sharedTree, node))
                }
                else {
                    dispatch(learnNode(node))
                }
            }
        },
        hover: (node) => {
            dispatch(hoverNode(node))
        },
        exit: () => {
            dispatch(hoverNode(null))
        }
    }
}

class SkillTree extends React.Component {
    render() {
        let tRows = []
        let sHeaders = []
        sHeaders[0] = <th key='0'></th>
        this.props.nodes.forEach((node, pos) => {
            if (pos.length == 2) {
                let t = pos[0]
                let s = pos[1]

                if (!sHeaders[s]) {
                    sHeaders[s] = <th key={s}>{stringParser(this.props.uiText.get('stage', ''), Map({stage: s}))}</th>
                }

                if (!tRows[t - 1]) {
                    tRows[t - 1] = []
                    tRows[t - 1][0] = <th key={t}>
                        {stringParser(this.props.uiText.get('tier', ''), Map({tier: t}))}
                    </th>
                }

                let path = null
                let parent = node.get('parent', '')
                if (parent.length == 2) {
                    let skip = pos - node.get('skip', pos)
                    let diff = pos - parent - skip
                    path = <div className={`path pos_${pos} diff_${parent}`}>
                        <div className={`arrow1 diff_${diff}`}></div>
                        <div className={`arrow2 diff_${skip}`}></div>
                        <Icon type='caret-down'/>
                    </div>
                }

                let learned = this.props.learned.indexOf(pos) != -1

                let pointCond = this.props.maxPoints >= this.props.usedPointsWithoutSkill + calculateUsedPointsSkill(this.props.nodes, pos)
                let learnable = !node.has('locked') && pointCond && this.props.levelCond

                let overlay = null
                if (node.has('locked')) {
                    overlay = <img src={overlays.bookLock}/>
                }
                else if (this.props.levelCond && !pointCond) {
                    overlay = <img src={overlays.noPoints}/>
                } else if (learnable && !learned) {
                    overlay = <img className='plus' src={overlays.plus}/>
                }

                let hmBorder = null
                if (t == 5) {
                    hmBorder = <img className='hm' src={border}/>
                }

                tRows[t - 1][s] = <td key={pos} className={learned
                    ? ''
                : ' inactive'}>
                    {path}
                    <div className={'node' + (learnable? ' learnable': '')}
                        onClick={() => this.props.learn(pos, learnable, this.props.sharedTree)}
                        onMouseOver={() => this.props.hover(pos)}
                        onMouseOut={() => this.props.exit()}
                        onContextMenu={(e) => this.props.unlearn(e, pos, learned, this.props.sharedTree)}
                        onTouchEnd={(e) => this.props.touch(e, pos, learnable, learned, this.props.sharedTree)}
                        onMouseDown={e => e.preventDefault()} data-tip data-for={pos}>

                        <div className={'overlay' + (pos == this.props.status? ' current' : '')}>
                            {overlay}
                        </div>
                        <img className='icon' src={`/images/skill/${node.get('icon')}.png`}/>
                    </div>
                    {hmBorder}
                </td>

            }
        })

        let tbody = []
        let i = 0
        for (let row of tRows) {

            let tds = []

            if (row) {
                let j = 0
                for (let x of row) {
                    if (x) {
                        tds.push(x)
                    } else {
                        tds.push(
                            <td key={`_${j}`}></td>
                        )
                    }
                    j++
                }
            } else {
                tds.push(
                    <th key={i+1}>
                        {stringParser(this.props.uiText.get('tier', ''), Map({tier: i + 1}))}
                    </th>,
                    <td key={0}></td>
                )
            }

            tbody.push(
                <tr key={i}>
                    {tds}
                </tr>
            )
            i++
        }

        let content = null
        if (tbody.length > 0) {
            content = <table className='nodes'>
                <thead>
                    <tr>
                        {sHeaders}
                    </tr>
                </thead>
                <tbody>
                    {tbody}
                </tbody>
            </table>
        }
        else {
            content = <p className='noTree'>{stringParser(this.props.uiText.get('noTree', ''), Map({skillName: this.props.nodes.getIn(['0', 'name'], '')}))}</p>
        }

        return (
            <div className='skillTree'>
                {content}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillTree)
