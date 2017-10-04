import React from 'react'
import { connect } from 'react-redux'

import {
    namespaceSelector,
    groupSelector,
    referenceGroupDataSelector,
    languageGroupDataSelector
} from '../selectors'
import { editTranslation } from '../actions'

const mapStateToProps = state => {
    return {
        namespace: namespaceSelector(state),
        group: groupSelector(state),
        referenceData: referenceGroupDataSelector(state),
        languageData: languageGroupDataSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        edit: (key, value) => dispatch(editTranslation(key, value))
    }
}

const TranslatorEditor = props => {
    let { namespace, group, referenceData, languageData, edit } = props

    let keys = []
    referenceData.forEach((value, key) => {
        if (!key.endsWith('_plural')) {
            keys.push(
                <div className="language-input-group" key={key}>
                    <p className="language-key">{key}</p>
                    <p className="language-reference">{value}</p>
                    <input
                        className="language-input"
                        value={languageData.get(key, '')}
                        onChange={e => edit(key, e.target.value)}
                    />
                </div>
            )
        }
    })

    return (
        <div className="translator-editor">
            {group !== 'none' ? (
                <h4>
                    {group.substr(3)} <small>{namespace}</small>
                </h4>
            ) : null}
            {keys}
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslatorEditor)
