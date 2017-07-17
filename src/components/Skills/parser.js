import React from 'react'
import i18n from 'i18next'
import {Interpolate} from 'react-i18next'
import {Map, List} from 'immutable'
import {Icon} from 'antd'
import elementImages from './images/map_elementImg'

function getSkill(idString, skillNames, noIcon=false) {
    let skillQuery = idString.split(/ +/)
    let id = skillQuery[0]
    let moves = skillQuery.slice(1)
    let name = skillNames.getIn([id, 'name'])

    let affix = null
    if (moves.length > 0) {
        affix = i18n.t('skills:moves', {moves: moves.join(', ')})
    }
    
    let icon = null
    if (!noIcon) {
        icon = <img alt={id} src={`https://static.bnstree.com/images/skill/${skillNames.getIn([id, 'icon'])}`}/>
    }
    return <span key={id}><span className='skill'>{icon} {name}</span> {affix}</span>
}

export default function parser(obj, defaultElement, stats, skillNames, obj2=List()) {
    let template = obj.get(0)
    let options = obj.get(1, Map())
    let elementSpec = obj.get(2, defaultElement)
    if (elementSpec !== defaultElement) {
        return null
    }

    let element = options.get('element')
    if (element === 'default') {
        element = defaultElement
        options = options.set('element', element)
    }

    options = options.map((value, key) => {
        switch(key) {
            case 'scale': 
            case 'scaleDual':
            case 'scalePet' : {
                let intl = new Intl.NumberFormat(i18n.language)
                let ap = key === 'scalePet' ? stats.get('apPet', 5) : stats.get('ap', 13)
                let ad = stats.get('ad', 0)
                let c = stats.get('c', 1)

                let multiplyer = 1 * stats.getIn(['element', element], 100) / 100
                let scale = value
                let bottomScale = List.isList(scale) ? scale.get(0) : scale
                let topScale = List.isList(scale) ? scale.get(1) : scale

                let bottom = Math.round(Math.round((ap - c) * bottomScale) * multiplyer + ad)
                let top = Math.round(Math.round((ap + c) * topScale) * multiplyer + ad)
                bottom = bottom > 0 ? bottom : 0
                top = top > 0 ? top : 0

                let scaleTxt = List.isList(scale) ? `${bottomScale.toFixed(2)} ~ ${topScale.toFixed(2)}` : scale.toFixed(2)
                if (multiplyer > 1) {
                    scaleTxt += ` × ${multiplyer.toFixed(2)}`
                }
                scaleTxt = key === 'scalePet' ? i18n.t('tooltip:scalePet', {scaleTxt: scaleTxt}) : i18n.t('tooltip:scale', {scaleTxt: scaleTxt})

                value = <span className={`damage ${multiplyer > 1 ? 'boosted' : ''}`} key={key}>
                    {intl.format(bottom)} ~ {intl.format(top)} <span className={`scale ${key === 'scalePet' ? 'pet' : ''}`}>[{scaleTxt}]</span>
                </span>
                break
            } 
            case 'skill':
            case 'skillName': {
                let skillList = []
                if (List.isList(value)) {
                    value.forEach(idString => {
                        skillList.push(getSkill(idString, skillNames, key==='skillName'))
                    })
                }
                else {
                    skillList.push(getSkill(value, skillNames, key==='skillName'))
                }
                value = <span>{skillList}</span>
                break
            }
            default: {
                if (isNaN(value)) {
                    if (List.isList(value)) {
                        value = value.map((s) => i18n.t(`tooltip:${s}`)).join(', ')
                    }
                    else {
                        value = i18n.t(`tooltip:${value}`)
                    }
                }
                else if (obj2 && obj2.get(1) && obj2.getIn([1, key]) !== value) {
                    value = <span key={key}>{obj2.getIn([1, key])} <Icon type="caret-right" /> {value}</span>
                }
            }
        }
        return value
    })

    if (element) {
        element = <img className='element' alt={element} src={elementImages[element]}/>
    }

    return <span><Interpolate i18nKey={`tooltip:${template}`} {...options.toJS()}/> {element}</span>
}
