import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {dataStatusSelector, groupSelector} from '../selectors'
import {setGroup} from '../actions'

import {Collapse, Badge} from 'antd'
const Panel = Collapse.Panel

const mapStateToProps = state => {
    return {
        currentGroup: groupSelector(state),
        dataStatus: dataStatusSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setGroup: (namespace, group) => dispatch(setGroup(namespace, group))
    }
}

const TranslatorSelectorItem = props => {
    let {items, dataStatus, setGroup, names, currentGroup} = props

    let selections = []
    items.forEach((data, namespace) => {
        let groups = []
        data.forEach((group, i) => {
            let groupStatus = dataStatus.get(namespace, Map())
            let key = group.get('_id', '')
            groups.push(
                <li
                    key={i}
                    className={`translator-selector-item ${key === currentGroup ? 'active' : ''}`}>
                    <a onClick={() => setGroup(namespace, key)}>
                        <Badge
                            status={groupStatus.getIn([key, 'dataStatus'], 'error')}
                            text={names ? key : key.substr(3)}
                        />
                    </a>
                </li>
            )
        })

        selections.push(
            <Panel
                key={namespace}
                header={
                    <Badge
                        status={dataStatus.getIn([namespace, 'dataStatus'], 'error')}
                        text={namespace}
                    />
                }>
                <ul>{groups}</ul>
            </Panel>
        )
    })

    return <Collapse bordered={false}>{selections}</Collapse>
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslatorSelectorItem)
