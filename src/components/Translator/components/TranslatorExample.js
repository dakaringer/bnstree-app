import React from 'react'
import {connect} from 'react-redux'
import replace from 'react-string-replace'
import {Map, List} from 'immutable'

import {rawSkillNameDataSelector, rawItemNameDataSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        skillNames: rawSkillNameDataSelector(state),
        itemNames: rawItemNameDataSelector(state)
    }
}

const TranslatorExample = props => {
    let {example, referenceData, languageData, skillNames, itemNames} = props

    let variables = example.get('variables')

    let reference = parse(referenceData, variables, skillNames)
    let test = parse(languageData, variables, skillNames)

    let name = getName(example.get('name'), skillNames, itemNames)

    return (
        <div className="translator-example">
            <h5>Example (from {name})</h5>
            <p>{reference}</p>
            <p>{test}</p>
        </div>
    )
}

export default connect(mapStateToProps)(TranslatorExample)

function parse(data, variables, skillNames) {
    let result = data
    variables = variables.set('additional', 'additional').set('element', 'element')
    variables.forEach((value, v) => {
        switch (v) {
            case 'skill':
            case 'skill-2':
            case 'skillName':
            case 'skillName-2': {
                let skillList = []
                if (List.isList(value)) {
                    value.forEach(idString => {
                        if (skillList.length !== 0) {
                            skillList.push(', ')
                        }
                        skillList.push(getName(idString, skillNames, v.startsWith('skillName')))
                    })
                } else {
                    skillList.push(getName(value, skillNames, v.startsWith('skillName')))
                }
                value = <span>{skillList}</span>
                break
            }
            default: {
                if (List.isList(value)) {
                    value = `[${value.join(', ')}]`
                }
            }
        }
        let count = 0
        let re = new RegExp(`({{${v}}})`, 'g')
        result = replace(result, re, () => {
            count++
            return (
                <span className="variable" key={v + count}>
                    {value}
                </span>
            )
        })
    })
    return result
}

function getName(value, skillNames, itemNames = List()) {
    let id = value.split(/ +/)[0]
    let obj = skillNames.find(doc => doc.get('_id') === id)
    let icon = null
    if (obj) {
        icon = <img alt={id} src={`https://static.bnstree.com/images/skills/${obj.get('icon')}`} />
    } else {
        obj = itemNames.find(doc => doc.get('_id') === id, null, Map())
        if (id.startsWith('BADGE')) {
            icon = (
                <img alt={id} src={`https://static.bnstree.com/images/badges/${obj.get('icon')}`} />
            )
        }
    }
    let name = obj.getIn(['name', 'en'])

    return (
        <span key={id} className="name">
            {icon} {name}
        </span>
    )
}
