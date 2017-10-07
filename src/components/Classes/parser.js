import React from 'react'
import i18n from 'i18next'
import {Interpolate} from 'react-i18next'
import {Map, List} from 'immutable'
import {Icon} from 'antd'
import elementImages from './images/map_elementImg'

function getSkill(idString, skillNames, noIcon = false) {
    let skillQuery = idString.split(/ +/)
    let id = skillQuery[0]
    let moves = skillQuery.slice(1)
    let name = skillNames.getIn([id, 'name'])

    let affix = null
    if (isNaN(moves[0])) {
        affix = i18n.t(moves[0])
        moves = moves.slice(1)
    }

    moves = moves.map(
        m =>
            m > 3
                ? i18n.t('classes:moveTypeHM', {move: m - 3})
                : i18n.t('classes:moveType', {move: m})
    )

    if (moves.length > 0) {
        affix = `${affix ? `${affix}, ` : ''}${moves.join(', ')}`
    }

    affix = affix ? ` (${affix})` : null

    let icon = null
    if (!noIcon) {
        icon = (
            <img
                alt={id}
                src={`https://static.bnstree.com/images/skills/${skillNames.getIn(
                    [id, 'icon'],
                    'blank'
                )}`}
            />
        )
    }
    return (
        <span key={id}>
            <span className="skill">
                {icon} {name}
            </span>
            {affix}
        </span>
    )
}

export default function parser(obj, defaultElement, stats, skillNames, obj2 = List()) {
    let template = obj.get(0)
    let options = obj.get(1, Map())
    let elementSpec = obj.get(2, defaultElement)
    if (defaultElement && elementSpec !== defaultElement) {
        return null
    }

    let element = options.get('element')
    if (element === 'default') {
        element = defaultElement
        options = options.set('element', element)
    }

    if (!element) {
        options = options.set('element', '')
    }
    if (!options.has('additional')) {
        options = options.set('additional', '')
    }

    options = options.map((value, key) => {
        switch (key) {
            case 'scale': {
                if (stats) {
                    let pet = options.has('pet')

                    let intl = new Intl.NumberFormat(i18n.language)
                    let ap = pet ? stats.get('apPet', 5) : stats.get('ap', 13)
                    ap = ap === '' || isNaN(ap) ? (pet ? 5 : 13) : parseInt(ap, 10)
                    let ad = stats.get('ad', 0)
                    ad = ad === '' || isNaN(ad) ? 0 : parseInt(ad, 10)
                    let c = stats.get('c', 1)
                    c = c === '' || isNaN(c) ? 1 : parseInt(c, 10)
                    let elementDmg = stats.getIn(['element', element], 100)
                    elementDmg =
                        elementDmg === '' || isNaN(elementDmg) ? 100 : parseInt(elementDmg, 10)

                    let multiplyer = 1 * elementDmg / 100
                    let scale = value
                    let bottomScale = List.isList(scale) ? scale.get(0) : scale
                    let topScale = List.isList(scale) ? scale.get(1) : scale

                    let bottom = Math.round(Math.round((ap - c) * bottomScale) * multiplyer + ad)
                    let top = Math.round(Math.round((ap + c) * topScale) * multiplyer + ad)
                    bottom = bottom > 0 ? bottom : 0
                    top = top > 0 ? top : 0

                    let scaleTxt = List.isList(scale)
                        ? `${bottomScale.toFixed(2)} ~ ${topScale.toFixed(2)}`
                        : scale.toFixed(2)
                    if (multiplyer > 1) {
                        scaleTxt += ` × ${multiplyer.toFixed(2)}`
                    }
                    scaleTxt = pet
                        ? i18n.t('tooltip:scalePet', {scaleTxt: scaleTxt})
                        : i18n.t('tooltip:scale', {scaleTxt: scaleTxt})

                    value = (
                        <span className={`damage ${multiplyer > 1 ? 'boosted' : ''}`} key={key}>
                            {intl.format(bottom)} ~ {intl.format(top)}{' '}
                            <span className={`scale ${pet ? 'pet' : ''}`}>[{scaleTxt}]</span>
                        </span>
                    )
                }
                break
            }
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
                        skillList.push(getSkill(idString, skillNames, key.startsWith('skillName')))
                    })
                } else {
                    skillList.push(getSkill(value, skillNames, key.startsWith('skillName')))
                }
                value = <span>{skillList}</span>
                break
            }
            case 'effect': {
                value = <span className="skill">{i18n.t(`tooltip:${value}`)}</span>
                break
            }
            default: {
                if (obj2 && obj2.get(1) && obj2.getIn([1, key]) !== obj.getIn([1, key])) {
                    value = (
                        <span key={key}>
                            {obj2.getIn([1, key])} <Icon type="caret-right" /> {value}
                        </span>
                    )
                }

                if (key === 'resource') {
                    value = i18n.t(`tooltip:${value}`, {
                        count: options.get('count', 1)
                    })
                } else if (key !== 'count' && key.startsWith('count')) {
                    value = isNaN(value) ? (
                        <Interpolate
                            i18nKey={`tooltip:${key}`}
                            count={value}
                            options={{count: obj.getIn([1, key])}}
                        />
                    ) : (
                        i18n.t(`tooltip:${key}`, {count: value})
                    )
                } else if (isNaN(value)) {
                    if (List.isList(value)) {
                        value = value.map(s => i18n.t(`tooltip:${s}`)).join(', ')
                    } else if (typeof value === 'string' && !value.includes('/')) {
                        value = i18n.t(`tooltip:${value.split('-')[0]}`)
                    }
                }
            }
        }
        return value
    })

    if (element && element !== 'elemental') {
        element = <img className="element" alt={element} src={elementImages[element]} />
    }

    options = options.toJS()
    return (
        <span>
            <Interpolate
                i18nKey={`tooltip:${template}`}
                options={{count: options.count}}
                {...options}
            />{' '}
            {element}
        </span>
    )
}
