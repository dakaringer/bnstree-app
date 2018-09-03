import React from 'react'
import {connect} from 'react-redux'
import {Map, List, fromJS} from 'immutable'

import {constantSelector, statSelector, skillNameRefSelector, skillIconRefSelector, templateSelector} from '../../trainer2/selector'
import {currentLanguageSelector} from '../../../selector'
import {stringParser} from '../../trainer2/parser'

import {
    uiTextSelector,
    classSkillDataSelector
} from '../selector'

import {Icon} from 'antd'

import TagList from '../../trainer2/components/TagList'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SKILL_TOOLTIP', Map()),
        constants: constantSelector(state),
        characterStats: statSelector(state),
        skillRef: Map({name: skillNameRefSelector(state), icon: skillIconRefSelector(state)}),
        templates: templateSelector(state),
        locale: currentLanguageSelector(state),
        currentElement: classSkillDataSelector(state).element
    }
}

const CharacterSkillTooltip = (props) => {
    let variationIndex = props.skill.get('variationIndex')
    let currentType = (variationIndex[1] - 1).toString()
    if (variationIndex[0] >= 5) {
        currentType = currentType + '-hm'
    }
    let currentTypeArr = currentType.split('-')
    let thisType = (props.variationIndex[1] - 1).toString()
    if (props.variationIndex[0] >= 5) {
        thisType = thisType + '-hm'
    }
    let thisTypeArr = thisType.split('-')

    let currentTooltip = props.skill.getIn(['types', currentTypeArr[0], currentTypeArr.length > 1 ? 'hmTraits' : 'traits'])
    let thisTooltip = props.skill.getIn(['types', thisTypeArr[0], thisTypeArr.length > 1 ? 'hmTraits' : 'traits'])

    let constants = Map({
        stats: props.characterStats,
        skillRef: props.skillRef,
        uiText: props.uiText,
        locale: props.locale
    }).merge(props.constants)

    let attb = {
        m1: [],
        m2: [],
        sub: []
    }

    let currentAttributes = currentTooltip.get('attributes')
    thisTooltip.get('attributes').forEach((a, i) => {
        if (a.getIn(['variables', 'damage', 'element']) == 'default') {
            a = a.setIn(['variables', 'damage', 'element'], props.currentElement)
        }
        let thisVariables = a.get('variables', Map())
        let currentVariables = null

        currentAttributes.forEach((b, j) => {
            if (b.getIn(['variables', 'damage', 'element']) == 'default') {
                b = b.setIn(['variables', 'damage', 'element'], props.currentElement)
            }
            if (a.get('template') === b.get('template') && a.get('variables', Map()).keySeq().equals(b.get('variables', Map()).keySeq()) && a.get('modId', 0) == b.get('modId', 0)) {
                if (a.get('template') !== 'TEMPLATE_INFLICT_STATUS' || a.getIn(['variables', 'status']) === b.getIn(['variables', 'status'])) {
                    currentVariables = b.get('variables', Map())
                    currentAttributes = currentAttributes.delete(j)
                    return false
                }
            }
        })

        let flag = ''
        let delText = null
        if (!currentVariables) {
            flag = 'add'
        }
        else if (!currentVariables.equals(thisVariables) && currentVariables.keySeq().equals(thisVariables.keySeq())) {
            flag = 'mod'
            let numerical = true

            currentVariables.forEach((v, k) => {
                if ((isNaN(v) || typeof(v) === 'boolean') && !(thisVariables.get(k) == v || (List.isList(v) || Map.isMap(v) && v.equals(thisVariables.get(k))))) {
                    numerical = false
                    return false
                }
            })

            if (!numerical || thisVariables.has('damage')) {
                delText = stringParser(a.set('variables', currentVariables), props.templates, constants)
            }
        }

        let modTag = null
        if (flag == 'add' || flag == 'mod') {
            modTag = <span className={`modTag ${flag}`}>{props.uiText.get(flag)}</span>
        }

        attb[a.get('group', 'sub')].push(
            <p className={`${flag}`} key={i}>{stringParser(a, props.templates, constants, currentVariables)} {modTag}</p>
        )

        if (delText) {
            attb[a.get('group', 'sub')].push(
                <p className='delete' key={`m-${i}`}>{delText}</p>
            )
        }
    })
    currentAttributes.forEach((c, i) => {
        attb[c.get('group', 'sub')].push(
            <p className='delete' key={`d-${i}`}>{stringParser(c, props.templates, constants)}</p>
        )
    })

    let subAttb = {
        stanceChange: [],
        conditions: [],
        unlock: []
    }

    let currentSubAttributes = currentTooltip.get('subAttributes', List())
    thisTooltip.get('subAttributes', List()).forEach((a, i) => {
        let thisVariables = a.get('variables', Map())
        let currentVariables = null

        currentSubAttributes.forEach((b, j) => {
            if (a.get('template') === b.get('template') && a.get('variables', Map()).keySeq().equals(b.get('variables', Map()).keySeq()) && a.get('modId', 0) == b.get('modId', 0)) {
                currentVariables = b.get('variables', Map())
                currentSubAttributes = currentSubAttributes.delete(j)
                return false
            }
        })

        let group = a.get('group', 'conditions')
        let flag = ''
        let modTag = null
        let icon = a.get('icon', 'buff_debuff_icon_08_53')
        if (group != 'unlock') {
            if (!currentVariables) {
                flag = 'add'
            }
            else if (!currentVariables.equals(thisVariables) && currentVariables.keySeq().equals(thisVariables.keySeq())) {
                flag = 'mod'
            }

            if (flag == 'add' || flag == 'mod') {
                modTag = <span className={`modTag ${flag}`}>{props.uiText.get(flag)}</span>
            }
        }
        else {
            icon = 'achievement'
        }

        if (subAttb[group].length == 0) {
            let header = <h6 key={group}>{props.uiText.get(group, '')}</h6>
            subAttb[group].push(header)
        }

        subAttb[group].push(
            <div key={i} className={`${flag}`}>
                <img className='icon' src={`/images/skill/${icon}.png`}/>
                <span>{stringParser(a, props.templates, constants, currentVariables)} {modTag}</span>
            </div>
        )
    })
    currentSubAttributes.forEach((c, i) => {
        let group = c.get('group', 'conditions')
        if (group != 'unlock') {
            if (subAttb[group].length == 0) {
                let header = <h6 key={group}>{props.uiText.get(group, '')}</h6>
                subAttb[group].push(header)
            }

            subAttb[group].push(
                <div key={`d-${i}`} className='delete'>
                    <img className='icon' src={`/images/skill/${c.get('icon', 'buff_debuff_icon_08_53')}.png`}/>
                    <span>{stringParser(c, props.templates, constants)}</span>
                </div>
            )
        }
    })

    let focusTxt = null
    let thisFocus = thisTooltip.get('focus')
    let currentFocus = currentTooltip.get('focus')

    let regen = props.uiText.get('focusRegen')
    let cost = props.uiText.get('focusCost')
    let affix = ''
    if (thisTooltip.has('health')) {
        thisFocus = thisTooltip.get('health')
        currentFocus = currentTooltip.get('health')
        regen = props.uiText.get('healthCost')
        cost = props.uiText.get('healthCost')
        affix = '%'
    }

    if (thisType != currentType && currentFocus != thisFocus) {
        let txt2 = `${Math.abs(thisFocus)}${affix}`
        let txt1 = `${currentFocus > 0 ? regen : cost} ${Math.abs(currentFocus)}${affix}`
        if ((thisFocus > 0 != currentFocus > 0 || thisFocus < 0 != currentFocus < 0) && thisFocus != 0) {
            txt2 = `${thisFocus > 0 ? regen : cost} ${Math.abs(thisFocus)}${affix}`
        }

        if (currentFocus == 0) {
            focusTxt = <span className='mod'>{txt2}</span>
        }
        else {
            focusTxt = <span>{txt1} <Icon type="caret-right" /> <span className='mod'>{txt2}</span></span>
        }
    }
    else if (thisFocus != 0) {
        focusTxt = `${thisFocus >= 0 ? regen : cost} ${Math.abs(thisFocus)}${affix}`
    }

    let info = []
    if (thisTooltip.has('info')) {
        info.push(infoBox(currentTooltip.getIn(['info', 'range'], 0),
            thisTooltip.getIn(['info', 'range'], 0),
            props.uiText.get('range', ''),
            props.uiText.get('zeroRange', ''),
            'm',
            null,
            props.currentElement))

        let area = null
        let a1Area = currentTooltip.getIn(['info', 'area', props.currentElement], currentTooltip.getIn(['info', 'area']))
        let a2Area = thisTooltip.getIn(['info', 'area', props.currentElement], thisTooltip.getIn(['info', 'area']))

        let a1Type = a1Area.get('type', 0)
        let a1Value = a1Area.get('value', 0)
        let a2Type = a2Area.get('type', 0)
        let a2Value = a2Area.get('value', 0)

        if (a1Type != a2Type) {
            area =
                <div className="info">
                    <div className={`area_${a1Type}`}>{a1Type == 0 ? props.uiText.get('zeroArea', '') : `${a1Value}m`}</div>
                    <Icon type="caret-down" />
                    <div className={`mod area_${a2Type}`}>{a2Type == 0 ? props.uiText.get('zeroArea', '') : `${a2Value}m`}</div>
                </div>
        }
        else if (a1Value != a2Value) {
            area =
                <div className={`info area_${a1Type}`}>
                    <div>{a1Type == 0 ? props.uiText.get('zeroArea', '') : `${a1Value}m`}</div>
                    <Icon type="caret-down" />
                    <div className='mod'>{a2Type == 0 ? props.uiText.get('zeroArea', '') : `${a2Value}m`}</div>
                </div>
        }
        else {
            area =
                <div className={`info area_${a1Type}`}>
                    <div>{a1Type == 0 ? props.uiText.get('zeroArea', '') : `${a1Value}m`}</div>
                </div>
        }

        info.push(
            <div className="info-box" key='area'>
                <div className="info-header">{props.uiText.get('area', '')}</div>
                {area}
            </div>
        )

        info.push(infoBox(currentTooltip.getIn(['info', 'cast'], 0),
            thisTooltip.getIn(['info', 'cast'], 0),
            props.uiText.get('cast', ''),
            props.uiText.get('zeroTime', ''),
            props.uiText.get('timeUnit', ''),
            props.uiText.get('timeUnit2', ''),
            props.currentElement))
        info.push(infoBox(currentTooltip.getIn(['info', 'cooldown'], 0),
            thisTooltip.getIn(['info', 'cooldown'], 0),
            props.uiText.get('cooldown', ''),
            props.uiText.get('zeroTime', ''),
            props.uiText.get('timeUnit', ''),
            props.uiText.get('timeUnit2', ''),
            props.currentElement))
    }

    let tags = thisTooltip.get('tags', List())
    let currentTags = currentTooltip.get('tags', List())
    currentTags.forEach(tag => {
        if (!tags.includes(tag)) {
            tags = tags.push(tag.set('flag', 'disabled'))
        }
    })

    return (
        <div className='skillTooltip'>
            <div className='topBlock'>
                <h3 className='name'>
                    {thisTooltip.get('name')}
                    <small className='classification'>{stringParser(fromJS({template: 'type', variables: {type: parseInt(thisTypeArr[0]) + 1}}), props.uiText)}</small>
                    <small className='classification'>{thisTypeArr[0], thisTypeArr.length > 1 ? 'HM' : ''}</small>
                </h3>
                <p className='focus'>{focusTxt}</p>
            </div>
            <div className='mainBlock'>
                <div>
                    <img className='icon' src={`/images/skill/${thisTooltip.get('icon')}.png`}/>
                </div>
                <div className='mainAttb'>
                    <div className='m1'>
                        {attb.m1}
                    </div>
                    <div className='m2'>
                        {attb.m2}
                    </div>
                </div>
            </div>
            <div className='subBlock'>
                {attb.sub}
            </div>
            <div className='infoBlock'>
                {info}
            </div>
            <div className='condBlock'>
                <div className='stance'>
                    {subAttb.stanceChange}
                </div>
                <div className='cond1'>
                    {subAttb.conditions}
                </div>
                <div className='unlock'>
                    {subAttb.unlock}
                </div>
            </div>
            <TagList tags={tags}/>
        </div>
    )
}

function infoBox(currentInfo, thisInfo, header, zero, unit = '', unit2 = null, element) {
    let box = []
    currentInfo = Map.isMap(currentInfo) ? currentInfo.get(element, 0) : currentInfo
    thisInfo = Map.isMap(thisInfo) ? thisInfo.get(element, 0) : thisInfo

    let text1 = currentInfo == 0 ? zero : `${currentInfo}${unit}`
    let text2 = thisInfo == 0 ? zero : `${thisInfo}${unit}`
    if (unit2) {
        let min = Math.floor(currentInfo / 60)
        let sec = currentInfo % 60
        let minText = min > 0 ? `${min}${unit2} ` : ''
        let secText = sec > 0 ? `${sec}${unit}` : ''

        let min2 = Math.floor(thisInfo / 60)
        let sec2 = thisInfo % 60
        let minText2 = min2 > 0 ? `${min2}${unit2} ` : ''
        let secText2 = sec2 > 0 ? `${sec2}${unit}` : ''

        text1 = currentInfo == 0 ? zero : minText + secText
        text2 = thisInfo == 0 ? zero : minText2 + secText2
    }

    if (currentInfo != thisInfo) {
        box.push(
            <Icon type="caret-down" key='down'/>,
            <div className="mod" key='modText'>{text2}</div>
        )
    }

    return (
        <div className="info-box" key={header}>
            <div className="info-header">{header}</div>
            <div className="info">
                <div>{text1}</div>
                {box}
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(CharacterSkillTooltip)
