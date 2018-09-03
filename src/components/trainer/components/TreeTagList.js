import React from 'react'
import {connect} from 'react-redux'

import {nodesSelector, learnedSelector, usedPointsSkillSelector, uiTextSelector, allTagsSelector} from '../selector'

import TagList from './TagList'

const mapStateToProps = (state) => {
    return {
        nodes: nodesSelector(state),
        learned: learnedSelector(state),
        usedPoints: usedPointsSkillSelector(state),
        usedText: uiTextSelector(state).getIn(['SKILL_TREE', 'usedPoints'], ''),
        tags: allTagsSelector(state)
    }
}

class TreeTagList extends React.Component {
    render() {
        let trainable = this.props.nodes.has('11')

        return (
            <div className='treeTagList'>
                <span className='treePointCounter'>{trainable ? `${this.props.usedText} ${this.props.usedPoints}` : ''}</span>
                <hr/>
                <TagList tags={this.props.tags}/>
            </div>
        )
    }
}

export default connect(mapStateToProps)(TreeTagList)
