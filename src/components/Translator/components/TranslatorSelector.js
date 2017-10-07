import React from 'react'
import {connect} from 'react-redux'
import {Map, List} from 'immutable'

import {Badge} from 'antd'

import {
    groupSelector,
    namespaceSelector,
    referenceDataSelector,
    dataStatusSelector
} from '../selectors'
import {setNamespace, setGroup} from '../actions'

const mapStateToProps = state => {
    return {
        group: groupSelector(state),
        namespace: namespaceSelector(state),
        referenceData: referenceDataSelector(state),
        dataStatus: dataStatusSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setNamespace: namespace => dispatch(setNamespace(namespace)),
        setGroup: group => dispatch(setGroup(group))
    }
}

const classes = [
    'BLADE_MASTER',
    'KUNG_FU_MASTER',
    'DESTROYER',
    'FORCE_MASTER',
    'ASSASSIN',
    'SUMMONER',
    'BLADE_DANCER',
    'WARLOCK',
    'SOUL_FIGHTER',
    'GUNSLINGER'
]

const items = ['BADGE_SOUL', 'BADGE_MYSTIC', 'SOULSHIELD']

class TranslatorSelector extends React.PureComponent {
    select(selection) {
        let {groupMode, setNamespace, setGroup} = this.props

        if (groupMode) {
            setGroup(selection)
        } else {
            setNamespace(selection)
            setGroup('none')
        }
    }

    render() {
        let {referenceData, dataStatus, namespace, group, groupMode} = this.props

        let list = List()
        if (groupMode) {
            dataStatus = dataStatus.get(namespace, Map())
            switch (namespace) {
                case 'skills':
                    list = List(classes)
                    break
                case 'items':
                    list = List(items)
                    break
                default:
                    list = namespace !== 'none' ? referenceData.get(namespace, List()) : list
                    list = list.map(group => group.get('_id'))
            }
        } else {
            list = referenceData
                .keySeq()
                .toList()
                .push('skills')
                .push('items')
        }

        let selections = []
        list.forEach(key => {
            let selected = key === (groupMode ? group : namespace)
            selections.push(
                <a
                    key={key}
                    className={`translator-selector-item ${selected ? 'active' : ''}`}
                    onClick={() => this.select(key)}>
                    <Badge
                        status={dataStatus.getIn([key, 'dataStatus'], 'error')}
                        text={
                            groupMode && namespace !== 'skills' && namespace !== 'items'
                                ? key.substr(3)
                                : key
                        }
                    />
                </a>
            )
        })

        return <div className="translator-selector">{selections}</div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslatorSelector)
