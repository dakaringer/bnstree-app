import React from 'react'
import {connect} from 'react-redux'

import {Badge} from 'antd'

import {
    namespaceSelector,
    groupSelector,
    referenceGroupDataSelector,
    languageGroupDataSelector,
    nameDataSelector,
    languageSelector,
    dataStatusSelector
} from '../selectors'
import {editTranslation, editNameTranslation} from '../actions'

const mapStateToProps = state => {
    return {
        namespace: namespaceSelector(state),
        group: groupSelector(state),
        referenceData: referenceGroupDataSelector(state),
        languageData: languageGroupDataSelector(state),
        nameData: nameDataSelector(state),
        language: languageSelector(state),
        dataStatus: dataStatusSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        edit: (key, value) => dispatch(editTranslation(key, value)),
        editName: (key, type, value) => dispatch(editNameTranslation(key, type, value))
    }
}

const TranslatorEditor = props => {
    let {
        namespace,
        group,
        referenceData,
        languageData,
        nameData,
        dataStatus,
        language,
        edit,
        editName
    } = props

    let keys = []
    if (namespace !== 'skills' && namespace !== 'items') {
        referenceData.forEach((value, key) => {
            if (!key.endsWith('_plural')) {
                keys.push(
                    <div className="language-input-group" key={key}>
                        <p className="language-key">
                            <Badge
                                status={dataStatus.getIn([namespace, group, key], 'default')}
                                text={key}
                            />
                        </p>
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
    } else {
        nameData.forEach(data => {
            let key = data.get('_id')

            let url = ''
            if (namespace === 'skills') {
                url = 'https://static.bnstree.com/images/skills'
            } else {
                if (group.startsWith('SOULSHIELD')) {
                    url = 'https://static.bnstree.com/images/soulshields/sets/'
                } else {
                    url = 'https://static.bnstree.com/images/badges/'
                }
            }

            let ssEffect = null
            if (group === 'SOULSHIELD') {
                ssEffect = (
                    <div className="ssEffect">
                        <p className="language-key">set effect</p>
                        <p>{data.getIn(['effect', 'en'], '')}</p>
                        <input
                            className="language-input"
                            value={data.getIn(['effect', language], '')}
                            onChange={e => editName(key, 'effect', e.target.value)}
                        />
                    </div>
                )
            }

            keys.push(
                <div className="language-input-group" key={key}>
                    <div className="language-input-header">
                        <img alt={key} src={`${url}/${data.get('icon', 'blank')}`} />
                        <div>
                            <p className="language-key">
                                <Badge
                                    status={dataStatus.getIn([namespace, group, key], 'default')}
                                    text={key}
                                />
                            </p>
                            <p className="language-reference">{data.getIn(['name', 'en'], '')}</p>
                        </div>
                    </div>
                    <input
                        className="language-input"
                        value={data.getIn(['name', language], '')}
                        onChange={e => editName(key, 'name', e.target.value)}
                    />
                    {ssEffect}
                </div>
            )
        })
    }

    return (
        <div className="translator-editor">
            {group !== 'none' ? (
                <h4>
                    {namespace !== 'skills' && namespace !== 'items' ? group.substr(3) : group}{' '}
                    <small>{namespace}</small>
                </h4>
            ) : null}
            {keys}
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslatorEditor)
