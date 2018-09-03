import React from 'react'
import {connect} from 'react-redux'
import {Map, List} from 'immutable'
import {Tooltip} from 'antd'

import SkillTooltip from './SkillTooltip'

import {
    filteredSkillListSelector,
    uiTextSelector,
    constantSelector,
    buildSelector,
    filterSelector,
    currentElementSelector
} from '../selector'
import {learnType} from '../actions'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SKILL_LIST', Map()),
        skillList: filteredSkillListSelector(state),
        constants: constantSelector(state),
        build: buildSelector(state),
        currentFilter: filterSelector(state),
        currentElement: currentElementSelector(state)
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        learnType: (skill, type) => dispatch(learnType(skill, type))
    }
}

class SKillGridItem extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            type: '0'
        }
    }

    hover(type) {
        this.setState({type: type})
    }

    render() {
        let types = []
        let currentType = this.props.build.get(this.props.skillId, '0')

        if (this.props.skill.get('types').size > 1) {
            this.props.skill.get('types').forEach((t, i) => {
                let hmButton = null
                let hmActive = false

                if (t.get('hmTraits')) {
                    hmActive = currentType == i + '-hm'
                    hmButton = <div className={`hmButton ${currentType == i + '-hm' ? 'active' : ''}`}
                        onClick={() => this.props.learnType(this.props.skillId, hmActive ? `${i}` : `${i}-hm`)}
                        onMouseOver={()=>this.hover(`${i}-hm`)}
                        onMouseLeave={()=>this.hover(currentType)}>
                    </div>
                }

                let filterList = t.get('filter', List())
                if (Map.isMap(filterList)) {
                    filterList = filterList.get(this.props.currentElement, List())
                }

                let classification = t.get('classification')
                if (Map.isMap(classification)) {
                    classification = classification.get(this.props.currentElement)
                }

                types.push(
                    <div key={i} className={`buttonWrap ${currentType.charAt(0) == i ? 'active' : ''}`}>
                        <div className={`innerWrap ${filterList.includes(this.props.currentFilter) ? 'glow' : ''}`}>
                            <div className='typeButton'
                                onClick={() => this.props.learnType(this.props.skillId, hmActive ? `${i}-hm` : `${i}`)}
                                onMouseOver={()=>this.hover(hmActive ? `${i}-hm` : `${i}`)}
                                onMouseLeave={()=>this.hover(currentType)}>
                                <h6>{this.props.constants.getIn(['TYPES', classification, 'text'])}</h6>
                            </div>
                            {hmButton}
                        </div>
                    </div>
                )
            })
        }

        let typeDiv = null

        if (types.length > 1) {
            typeDiv =
                <div className='skillItem'>
                    <div className={`types ${types.length == 1 ? 'single' : ''}`}>
                        {types}
                    </div>
                </div>
        }

        let tooltip =
            <div>
                {typeDiv}
                <SkillTooltip tooltipData={this.props.skill.get('types')} type={this.state.type} skillId={this.props.skillId}/>
            </div>


        return (
            <div className='gridSkill'>
                <Tooltip placement="bottomLeft" title={tooltip} align={{overflow: {adjustY: false, adjustX: true}}} overlayClassName='skillTooltipWrap'>
                    <div className='imgContainer'>
                        <img className='gridIcon' src={`/images/skill/${this.props.skill.get('icon')}.png`}/>
                    </div>
                    <p className={`gridSkillName ${types.length > 1 ? 'trainable' : ''}`}>{this.props.skill.get('name')}</p>
                </Tooltip>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SKillGridItem)
