import React from 'react'
import {Map, List} from 'immutable'

import {Icon} from 'antd'
import elementImages from './components/elementImg'

const regex = /(\d+)/

export function getLearned(nodes, pos) {
    let parent = nodes.getIn([
        pos, 'parent'
    ], null)
    if (!parent) {
        return []
    }
    return [pos].concat(getLearned(nodes, parent))
}

export function learned(nodes, status, pos) {
    if (getLearned(nodes, status).indexOf(pos) >= 0) {
        return pos
    }
    else {
        return null
    }
}

export function lastValid(nodes, pos, id) {
    if (nodes.getIn([pos, 'skillId'], '').startsWith(id)) {
        return pos
    }
    let parent = nodes.getIn([
        pos, 'parent'
    ], null)
    if (!parent) {
        return null
    }
    return lastValid(nodes, parent, id)
}

export function calculateUsedPointsSkill(nodes, pos) {
    let parent = nodes.getIn([
        pos, 'parent'
    ], null)
    if (!parent) {
        return 0
    }
    let points = 1
    if (pos[0] == 5) {
        points = 2
    }
    return points + calculateUsedPointsSkill(nodes, parent)
}

export function calculateUsedPoints(trees, build) {
    let total = 0
    build.forEach((pos, id) => total += calculateUsedPointsSkill(trees.getIn([id, 'nodes']), pos))
    return total
}

export function calculateMaxPoints(lv, hLv) {
    if (lv < 15) {
        return 0
    }

    let normal = lv - 14
    let extra = hLv == 0
        ? 0
        : (6 * hLv - Math.pow(-1, hLv) + 13) / 4
    return normal + extra
}

export function getElement(val, allTrees, allStatus) {
    if (!val) {
        return null
    }
    let alt = val.get('altElement', null)
    let element = val.get('element', null)
    if (alt) {
        let id = alt.get('skill')
        let nodes = allTrees.getIn([id, 'nodes'], Map())
        let status = allStatus.get(id, '0')

        let pos = alt.get('pos', [])
        pos.forEach(p => {
            if (learned(nodes, status, p)) {
                element = alt.get('element', null)
                return false
            }
        })
    }
    return element
}

export function getScale(val, allTrees, allStatus) {
    if (!val) {
        return null
    }
    let alt = val.get('altScale', null)
    let scale = val.get('scale', val.get('dualScale', 0))
    if (alt) {
        let id = alt.get('skill')
        let nodes = allTrees.getIn([id, 'nodes'], Map())
        let status = allStatus.get(id, '0')

        let pos = alt.get('pos', [])
        pos.forEach(p => {
            if (learned(nodes, status, p)) {
                scale = alt.get('scale', null)
                return false
            }
        })
    }
    return scale
}

export function stringParser(template, variables, options=Map(), variables2=null) {
    if (template === '') {
        return '##ERROR:Template not found'
    }
    let result = template.split(/{|}/)

    let stats = options.get('stats', Map())
    let attbText = options.get('attbText', Map())
    let skillRef = options.get('skillRef', Map())
    let select = options.get('select', null)
    let allTrees = options.get('allTrees', Map())
    let allStatus = options.get('allStatus', Map())
    let locale = options.get('locale', 'en')
    let uiText = options.get('uiText', Map())
    let tierStageTemp = options.get('tierStageTemp', '')

    let ap = stats.get('ap', 13)
    let ad = stats.get('ad', 0)
    let c = stats.get('c', 1)

    let element = null
    variables.forEach((val, key) => {
        let text = null

        const r = /([a-zA-Z]+)/
        let k = r.exec(key)[0]

        switch (k) {
            case 'damage': {
                let multiplyer = 1
                element = getElement(val, allTrees, allStatus)

                multiplyer = multiplyer * stats.getIn(['element', element], 100) / 100

                //let scale = val.get('scale', val.get('dualScale', 0))
                let scale = getScale(val, allTrees, allStatus)
                let bottomScale = List.isList(scale) ? scale.get(0) : scale
                let topScale = List.isList(scale) ? scale.get(1) : scale

                let bottom = Math.round(Math.round((ap - c) * bottomScale) * multiplyer + ad)
                let top = Math.round(Math.round((ap + c) * topScale) * multiplyer + ad)

                top = top > 0 ? top : 0
                bottom = bottom > 0 ? bottom : 0

                let scaleText = List.isList(scale) ? `${bottomScale.toFixed(2)}, ${topScale.toFixed(2)}` : scale.toFixed(2)
                if (multiplyer > 1) {
                    scaleText += ` * ${(multiplyer*100).toFixed(2)}%`
                }
                let intl = new Intl.NumberFormat(locale)
                text = <span className={`damage ${multiplyer > 1 ? 'boosted' : ''}`} key={key}>{intl.format(bottom)} ~ {intl.format(top)} <span className='scale'>[{scaleText}]</span></span>

                let eleIndex = result.indexOf('&element')
                if (eleIndex == -1) {
                    return '##ERROR:Missing {&element}'
                }
                result[eleIndex] = attbText.element.get(element, '')
                break
            }
            case 'skill' : {
                let skillList = []
                let comma = ''
                val.sort().forEach((idString) => {
                    let a = idString.split(/ +/)
                    let id = a[0]
                    let ts = a.slice(1)
                    let skillIcon = skillRef.getIn(['icon', id], '')
                    let skillName = skillRef.getIn(['name', id], '')

                    ts = ts.map(v => {
                        if (v.length == 1) {
                            if (v == 0) {
                                return uiText.get('basic').toLowerCase()
                            }
                            else {
                                return stringParser(uiText.get('stage', ''), Map({
                                    stage: v
                                })).join('').toLowerCase()
                            }
                        }
                        else {
                            return stringParser(tierStageTemp, Map({
                                tier: v[0],
                                stage: v[1]
                            })).join('').toLowerCase()
                        }
                    })

                    let affix = ''
                    if (ts.length > 0) {
                        affix = ` (${ts.join(', ').trim()})`
                    }

                    skillList.push(
                        <span key={id}>{comma}<span className='skill' onClick={() => select(regex.exec(id)[0])}><img className='icon' src={`/images/skill/${skillIcon}.png`}/>{skillName}</span>{affix}</span>
                    )
                    comma = ', '
                })
                text = <span key={key}>{skillList}</span>
                break
            }
            case 'condition':
            case 'stat': {
                let list = []
                val.forEach((s) => {
                    list.push(attbText[k].get(s, '').toLowerCase())
                })
                text = list.join(', ')
                break
            }
            case 'statusEffects': {
                let list = []
                val.forEach((s) => {
                    list.push(attbText.status.get(s, '').toLowerCase())
                })
                text = list.join(', ')
                break
            }
            case 'status':
            case 'buff': {
                text = attbText[k].get(val, '').toLowerCase()
                break
            }
            case 'stance':
            case 'resource': {
                text = attbText[k].getIn([val, 'text'], '').toLowerCase()
                break
            }
            case 'altVar': {
                let v = val.get('val1', null)

                let id = val.get('skill')
                let nodes = allTrees.getIn([id, 'nodes'], Map())
                let status = allStatus.get(id, '0')
                let pos =  val.get('pos', [])
                pos.forEach(p => {
                    if (learned(nodes, status, p)) {
                        v = val.get('val2', null)
                        return false
                    }
                })

                let index = result.indexOf(`&${val.get('type', '')}`)
                result[index] = v
                break
            }
            case 'skillName' : {
                text = <span key={key} className='skillName'>{val}</span>
                break
            }
            default: {
                if (variables2 && variables2.get(key) != val) {
                    text = <span key={key}>{variables2.get(key)} <Icon type="caret-right" /> {val}</span>
                }
                else {
                    text = val
                }
            }
        }

        for(let i = 0; i < result.length; i++) {
            if (result[i] === `&${key}`) {
                result[i] = text
            }
        }
    })

    if (element) {
        result.push(<img key='element' className='element' src={elementImages[element]}/>)
    }

    for (let n = 0; n < result.length; n++) {
        if (typeof result[n] === 'string' && result[n].trim() == '') {
            result[n] = ''
        }
        else {
            if(typeof result[n] === 'string' && result[n].length > 1) {
                result[n] = result[n].charAt(0).toUpperCase() + result[n].slice(1)
            }
            break
        }
    }

    return result
}


export function condParser(template, variables, icon, options=Map()) {
    if (template === '') {
        return '##ERROR:Template not found'
    }

    let result = template.split(/{|}/)

    let skillRef = options.get('skillRef', Map())
    let attbText = options.get('attbText', Map())
    let select = options.get('select', null)
    let uiText = options.get('uiText', Map())
    let tierStageTemp = options.get('tierStageTemp', '')

    let unlockCond = icon == 'book' || icon == 'achievement'

    variables.forEach((val, key) => {
        let index = result.indexOf(`&${key}`)

        switch (key) {
            case 'skill': {
                let a = val.split(/ +/)
                let id = a[0]
                let name = skillRef.getIn(['name', id], '')
                if (unlockCond) {
                    result[index] = <span key={key}>{name}</span>
                }
                else {
                    let ts = a.slice(1)
                    ts = ts.map(v => {
                        if (v.length == 1) {
                            if (v == 0) {
                                return uiText.get('basic').toLowerCase()
                            }
                            else {
                                return stringParser(uiText.get('stage', ''), Map({
                                    stage: v
                                })).join('').toLowerCase()
                            }
                        }
                        else {
                            return stringParser(tierStageTemp, Map({
                                tier: v[0],
                                stage: v[1]
                            })).join('').toLowerCase()
                        }
                    })

                    let affix = ''
                    if (ts.length > 0) {
                        affix = ` (${ts.join(', ').trim()})`
                    }

                    icon = skillRef.getIn(['icon', id], '')
                    result[index] = <span key={key}><span className='skill' onClick={() => select(regex.exec(val)[0])}>{name}</span>{affix}</span>
                }
                break
            }
            case 'statusEffects': {
                let list = []
                val.forEach((s) => {
                    list.push(attbText.status.get(s, '').toLowerCase())
                })

                result[index] = list.join(', ')
                break
            }
            case 'condition': {
                let list = []
                val.forEach((s) => {
                    list.push(attbText[key].get(s, '').toLowerCase())
                })
                result[index] = list.join(', ')
                break
            }
            case 'stance':
            case 'resource': {
                result[index] = attbText[key].getIn([val, 'text'], '').toLowerCase()
                icon = attbText[key].getIn([val, 'icon'], '')
                break
            }
            case 'status': {
                result[index] = attbText.status.get(val, '').toLowerCase()
                break
            }
            default: result[index] = val
        }
    })

    let iconSpan = <img className='icon' src={`/images/skill/${icon}.png`}/>

    if (unlockCond) {
        let unlockText = null
        unlockText = `${uiText.get(icon, '')}: `
        result = <span className='unlock'>{unlockText}<span className={icon}>{result}</span></span>
    }

    for (let n = 0; n < result.length; n++) {
        if (typeof result[n] === 'string' && result[n].trim() == '') {
            result[n] = ''
        }
        else {
            if(typeof result[n] === 'string' && result[n].length > 1) {
                result[n] = result[n].charAt(0).toUpperCase() + result[n].slice(1)
            }
            break
        }
    }

    return <span>{iconSpan}{result}</span>
}
