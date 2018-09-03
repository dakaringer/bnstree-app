import React from 'react'
import {Map, List, fromJS} from 'immutable'

import {Icon} from 'antd'
import elementImages from '../shared/images/map_elementImg'

export function stringParser(attbObj, templates, constants=Map(), tempVariables=null, raw=false) {
    if (templates.size == 0) {
        return
    }
    let template = templates.get(attbObj.get('template'))
    let variables = attbObj.get('variables', Map())
    if (!template) {
        console.log(`##ERROR:Template "${attbObj.get('template')}" not found`)
        return []
    }
    let stringArray = template.split(/{|}/)
    let result = []
    let element = null
    for (let str of stringArray) {
        if (str == '') {
            continue
        }

        let identifier = str.charAt(0)
        if (!(['#', '&', '$', '?'].includes(identifier))) {
            result.push(str)
            continue
        }

        let query = str.substring(1).split(/;+|=+/)
        let key = query[0]
        let value = variables.get(key)
        if (!value && key == 'skill') {
            value = variables.get('skillName')
            key = 'skillName'
        }
        if (!value && key !== 'elementType' && identifier !== '?') {
            continue
        }
        switch(identifier) {
            case '?': {
                //conditional flag
                if (eval(query[1])) {
                    result.push(query[2].trim())
                }
                else if (query[3]) {
                    result.push(query[3].trim())
                }
                break
            }
            case '&': {
                //existential flag
                result.push(query[1])
                break
            }
            case '#': {
                //clause
                let clause = null
                if (Map.isMap(value)) {
                    if (value.has('template')) {
                        clause = stringParser(value, templates, constants, tempVariables ? tempVariables.getIn([key, 'variables']) : null, true)
                    }
                    else {
                        let obj = {
                            template: query[1],
                            variables: value
                        }
                        clause = stringParser(fromJS(obj), templates, constants, tempVariables ? tempVariables.get(key) : null, true)
                    }
                }
                else {
                    let obj = {
                        template: query[1],
                        variables: {}
                    }

                    obj.variables[key] = value

                    let tempObj = null
                    if (tempVariables) {
                        tempObj = {}
                        tempObj[key] = tempVariables.get(key)
                    }

                    clause = stringParser(fromJS(obj), templates, constants, fromJS(tempObj), true)
                }
                result.push(clause)
                break
            }
            case '$': {
                //variable replacement
                switch(key) {
                    case 'damage': {
                        let locale = constants.get('locale', 'en')
                        let stats = constants.get('stats', Map())
                        let ap = stats.get('ap', 13)
                        let ad = stats.get('ad', 0)
                        let c = stats.get('c', 1)

                        if (value.has('pet')) {
                            ap = stats.get('petAp', 5)
                        }

                        element = value.get('element')

                        let multiplyer = 1 * stats.getIn(['element', element], 100) / 100
                        let scale = value.get('scale', value.get('dualScale', 0))
                        let bottomScale = List.isList(scale) ? scale.get(0) : scale
                        let topScale = List.isList(scale) ? scale.get(1) : scale

                        let bottom = Math.round(Math.round((ap - c) * bottomScale) * multiplyer + ad)
                        let top = Math.round(Math.round((ap + c) * topScale) * multiplyer + ad)

                        bottom = bottom > 0 ? bottom : 0

                        let scaleText = List.isList(scale) ? `${bottomScale.toFixed(2)} ~ ${topScale.toFixed(2)}` : scale.toFixed(2)
                        if (multiplyer > 1) {
                            scaleText += ` × ${multiplyer.toFixed(2)}`
                        }
                        let intl = new Intl.NumberFormat(locale)

                        let obj = {
                            template: value.has('pet') ? 'petScale' : 'scale',
                            variables: {
                                scale: scaleText
                            }
                        }
                        scaleText = stringParser(fromJS(obj), constants.get('uiText'), constants, null, false)
                        result.push(<span className={`damage ${multiplyer > 1 ? 'boosted' : ''}`} key={key}>{intl.format(bottom)} ~ {intl.format(top)} <span className={`scale ${value.has('pet') ? 'pet' : ''}`}>[{scaleText}]</span></span>)
                        break
                    }
                    case 'elementType' : {
                        element = variables.getIn(['damage', 'element'])
                        result.push(constants.getIn(['ELEMENT', element]))
                        break
                    }
                    case 'skill' :
                    case 'skillName' :  {
                        let skillRef = constants.get('skillRef', Map())

                        if (List.isList(value)) {
                            let list = []
                            let first = true
                            value.forEach((idString) => {
                                if (!first) {
                                    list.push(', ')
                                }
                                list.push(
                                    handleSkill(idString, templates, constants, skillRef, key=='skillName')
                                )
                                first = false
                            })
                            result.push(<span key={key}>{list}</span>)
                        }
                        else {
                            result.push(
                                <span key={key}>
                                    {handleSkill(value, templates, constants, skillRef, key=='skillName')}
                                </span>
                            )
                        }
                        break
                    }
                    case 'achievement': {
                        let obj = {
                            template: value,
                            variables: {
                                skillName: variables.get('skill')
                            }
                        }

                        obj.variables[key] = value

                        let clause = stringParser(fromJS(obj), constants.get(key.toUpperCase()), constants)

                        result.push(<span key={key} className='achievement'>{clause}</span>)
                        break
                    }
                    case 'condition':
                    case 'stat':
                    case 'status':
                    case 'element':
                    case 'skillType': {
                        let skillRef = constants.get('skillRef', Map())
                        if (List.isList(value)) {
                            let list = value.map((s) => constants.getIn([key.toUpperCase(), s], skillRef.getIn(['name', s], '')).toLowerCase())
                            result.push(list.join(', '))
                        }
                        else {
                            result.push(constants.getIn([key.toUpperCase(), value], skillRef.getIn(['name', value], '')).toLowerCase())
                        }
                        break
                    }
                    case 'buff':
                    case 'stance':
                    case 'resource': {
                        if (List.isList(value)) {
                            let list = value.map((s) => constants.getIn([key.toUpperCase(), s], ''))
                            result.push(list.join(', '))
                        }
                        else {
                            result.push(constants.getIn([key.toUpperCase(), value], ''))
                        }
                        break
                    }
                    default: {
                        if (tempVariables && tempVariables.get(key) != value) {
                            result.push(<span key={key}>{tempVariables.get(key)} <Icon type="caret-right" /> {value}</span>)
                        }
                        else {
                            result.push(value)
                        }
                    }
                }
            }
        }
    }

    if (element) {
        result.push(<img key='element' className='element' src={elementImages[element]}/>)
    }

    let r = []
    let f = false
    for (let x of result) {
        if (!f && (typeof x != 'string' || x.trim() != '')) {
            f = true
        }
        if (f) {
            r.push(x)
        }
    }

    if (!raw) {
        r[0] = capitalize(r[0])
    }
    else {
        r.push(' ')
    }

    return r
}

function capitalize(string) {
    if (typeof string === 'string') {
        string = string.replace(/^\s+/,'')
        return `${string.charAt(0).toUpperCase() + string.slice(1)}`
    }
    return string
}

function handleSkill(idString, templates, constants, skillRef, noIcon=false) {
    let skillQuery = idString.split(/ +/)
    let id = skillQuery[0]
    let types = skillQuery.slice(1)
    let skillName = skillRef.getIn(['name', id], skillRef.getIn([id, 'name'], ''))

    let affix = null
    if (types.length > 0) {
        let obj = {
            template: 'CLAUSE_TYPES',
            variables: {
                types: types.join(', ')
            }
        }

        affix = ` (${stringParser(fromJS(obj), templates, constants).join('').trim()})`
    }

    if (noIcon) {
        return <span key={id}><span className='skill'>{skillName}</span>{affix}</span>
    }
    else {
        let skillIcon = skillRef.getIn(['icon', id], skillRef.getIn([id, 'icon'], ''))
        return <span key={id}><span className='skill'><img className='icon' src={`/images/skill/${skillIcon}.png`}/>{skillName}</span>{affix}</span>
    }
}
