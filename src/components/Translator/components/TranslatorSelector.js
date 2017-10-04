import React from 'react'
import {connect} from 'react-redux'
import {List} from 'immutable'

import {groupSelector, namespaceSelector, referenceDataSelector} from '../selectors'
import {setNamespace, setGroup} from '../actions'

const mapStateToProps = state => {
    return {
        group: groupSelector(state),
        namespace: namespaceSelector(state),
        referenceData: referenceDataSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setNamespace: namespace => dispatch(setNamespace(namespace)),
        setGroup: group => dispatch(setGroup(group))
    }
}

class TranslatorSelector extends React.PureComponent {
    select(selection) {
        let {groupMode, setNamespace, setGroup} = this.props

        if (groupMode) {
            setGroup(selection)
        } else {
            setNamespace(selection)
        }
    }

    render() {
        let {referenceData, namespace, group, groupMode} = this.props

        if (groupMode) {
            referenceData = namespace !== 'none' ? referenceData.get(namespace, List()) : List()
        }

        let namespaces = []
        referenceData.forEach((data, key) => {
            let selected = key === namespace
            if (groupMode) {
                key = data.get('_id')
                selected = key === group
            }
            namespaces.push(
                <a
                    key={key}
                    className={`translator-selector-item ${selected ? 'active' : ''}`}
                    onClick={() => this.select(key)}>
                    {groupMode ? key.substr(3) : key}
                </a>
            )
        })

        return <div className="translator-selector">{namespaces}</div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslatorSelector)
