import React from 'react'
import {connect} from 'react-redux'
import {Map, List} from 'immutable'

import {treeDataSelector, buildSelector, currentSkillSelector, tooltipSelector, tempTooltipSelector, uiTextSelector, variableSelector, statSelector, skillNameRefSelector, skillIconRefSelector} from '../selector'
import {currentLanguageSelector} from '../../../selector'
import {selectSkill} from '../actions'
import {stringParser, condParser, getElement} from '../calc'

import {Icon} from 'antd'

import elementImages from './elementImg'
import TagList from './TagList'

const mapStateToProps = (state) => {
    return {
        allTrees: treeDataSelector(state),
        allStatus: buildSelector(state),
        currentSkill: currentSkillSelector(state),
        current: tooltipSelector(state),
        temp: tempTooltipSelector(state),
        tierStageTemp: uiTextSelector(state).getIn(['SKILL_LIST', 'tierStage'], ''),
        uiText: uiTextSelector(state).get('SKILL_TOOLTIP', Map()),
        attbText: {
            element: variableSelector(state).get('ELEMENTS', Map()),
            status: variableSelector(state).get('STATUS', Map()),
            buff: variableSelector(state).get('BUFF', Map()),
            resource: variableSelector(state).get('RESOURCE', Map()),
            stat: variableSelector(state).get('STAT', Map()),
            condition: variableSelector(state).get('CONDITION', Map()),
            stance: variableSelector(state).get('STANCE', Map())
        },
        stats: statSelector(state),
        skillRef: Map({
            name: skillNameRefSelector(state),
            icon: skillIconRefSelector(state)
        }),
        locale: currentLanguageSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        select: (id) => dispatch(selectSkill(id))
    }
}

function infoBox(arr, header, uiText, unit='', unit2='') {
    let box = null
    if (unit2 != '') {
        let min = Math.floor(arr[0]/60)
        let sec = arr[0]%60
        let minText = min > 0 ? `${min}${unit2} ` : ''
        let secText = sec > 0 ? `${sec}${unit}` : ''

        if (arr.length > 1 && arr[0] != arr[1]) {
            let min2 = Math.floor(arr[1]/60)
            let sec2 = arr[1]%60
            let minText2 = min2 > 0 ? `${min2}${unit2} ` : ''
            let secText2 = sec2 > 0 ? `${sec2}${unit}` : ''

            box =
                <div className="info">
                    <div>{arr[0] == 0 ? uiText : minText + secText}</div>
                    <Icon type="caret-down" />
                    <div className="mod">{arr[1] == 0 ? uiText : minText2 + secText2}</div>
                </div>
        }
        else {
            box =
                <div className="info">
                    <div>{arr[0] == 0 ? uiText : minText + secText}</div>
                </div>
        }
    }
    else {
        if (arr.length > 1 && arr[0] != arr[1]) {
            box =
                <div className="info">
                    <div>{arr[0] == 0 ? uiText : `${arr[0]}${unit}`}</div>
                    <Icon type="caret-down" />
                    <div className="mod">{arr[1] == 0 ? uiText : `${arr[1]}${unit}`}</div>
                </div>
        }
        else {
            box =
                <div className="info">
                    <div>{arr[0] == 0 ? uiText : `${arr[0]}${unit}`}</div>
                </div>
        }
    }
    return (
        <div className="info-box" key={header}>
            <div className="info-header">{header}</div>
            {box}
        </div>
    )
}

class SkillTooltip extends React.Component {
    render() {
        let tooltip = {}
        let temp = this.props.temp
        let current = this.props.current

        let parserOptions = Map({
            stats: this.props.stats,
            attbText: this.props.attbText,
            skillRef: this.props.skillRef,
            select: this.props.select,
            uiText: this.props.uiText,
            allTrees: this.props.allTrees,
            allStatus: this.props.allStatus,
            tierStageTemp: this.props.tierStageTemp,
            locale: this.props.locale
        })
        if (temp && !temp.equals(current)) {
            tooltip.name = temp.get('name', '')
            tooltip.pos = temp.get('pos', '')
            tooltip.icon = temp.get('icon', '')
            tooltip.focus = [current.get('focus', 0),temp.get('focus', 0)]
            tooltip.element = []
            let elements = []
            let currentAttributes = current.get('attributes', List())
            tooltip.attributes = []
            temp.get('attributes', List()).forEach((tAttb, key) => {
                let tempVar = tAttb.get('var', Map())
                let currentVar = null

                let e = getElement(tAttb.getIn(['var', 'damage']), this.props.allTrees, this.props.allStatus)

                if (e && elements.indexOf(e) == -1) {
                    elements.push(e)
                    tooltip.element.push(<img key={`${e}_${key}`} className='element' src={elementImages[e]}/>)
                }

                let variables = tAttb.get('var', Map())

                currentAttributes.forEach((cAttb, index) => {
                    if (cAttb.get('type', '') == tAttb.get('type', '')) {
                        currentVar = cAttb.get('var', Map())
                        if ((!currentVar.has('skill') || currentVar.get('skill').equals(variables.get('skill'))) &&
                            (!currentVar.has('skill2') || currentVar.get('skill2').equals(variables.get('skill2'))) &&
                            (!currentVar.has('status') || currentVar.get('status') == variables.get('status')) &&
                            (!currentVar.has('buff') || currentVar.get('buff') == variables.get('buff')) &&
                            (!currentVar.has('buff') || currentVar.get('buff2') == variables.get('buff2')) &&
                            (!currentVar.has('stat') || currentVar.get('stat').equals(variables.get('stat'))) &&
                            (cAttb.get('modId', 0) == tAttb.get('modId', 0))) {
                            currentAttributes = currentAttributes.delete(index)
                            return false
                        }
                    }
                    currentVar = null
                })

                let flag = ''
                let delText = null
                let text = ''
                if (!currentVar) {
                    flag = 'add'
                }
                else if (variables.has('damage') && !variables.equals(currentVar)) {
                    flag = 'mod'
                    delText = stringParser(tAttb.get('template', ''), currentVar, parserOptions)
                }
                else if (!tempVar.equals(currentVar)) {
                    if (variables.has('skill')) {
                        if (variables.get('skill').equals(currentVar.get('skill'))) {
                            flag = 'mod'
                            text = stringParser(tAttb.get('template', ''), variables, parserOptions, currentVar)
                        }
                        else {
                            flag = 'add'
                        }
                    }
                    else {
                        flag = 'mod'
                        text = stringParser(tAttb.get('template', ''), variables, parserOptions, currentVar)
                    }
                }

                text = text == '' ? stringParser(tAttb.get('template', ''), variables, parserOptions) : text

                let group = tAttb.get('group', 'sub')
                tooltip.attributes.push({
                    text: text,
                    group: group,
                    flag: flag
                })

                if (delText) {
                    tooltip.attributes.push({
                        text: delText,
                        group: group,
                        flag: 'delete'
                    })
                }
            })
            currentAttributes.forEach((cAttb) => {
                tooltip.attributes.push({
                    text: stringParser(cAttb.get('template', ''), cAttb.get('var', Map()), parserOptions),
                    group: cAttb.get('group', 'sub'),
                    flag: 'delete'
                })
            })

            let currentSubAttributes = current.get('subAttributes', List())
            tooltip.subAttributes = []
            temp.get('subAttributes', List()).forEach((tAttb) => {
                let tempVar = tAttb.get('var', Map())
                let currentVar = null

                let variables = tAttb.get('var', Map())

                currentSubAttributes.forEach((cAttb, index) => {
                    if (cAttb.get('type', '') == tAttb.get('type', '')) {

                        currentVar = cAttb.get('var', Map())
                        if (!currentVar.has('skill') || currentVar.get('skill') == variables.get('skill')) {
                            currentSubAttributes = currentSubAttributes.delete(index)
                            return false
                        }
                    }
                })

                let flag = ''
                let delText = null
                let text = condParser(tAttb.getIn(['template', 'template'], ''), variables, tAttb.getIn(['template', 'icon'], ''), parserOptions)
                if (!currentVar) {
                    flag = 'add'
                }
                else if (!tempVar.equals(currentVar)) {
                    if (variables.has('skill')) {
                        flag = 'add'
                    }
                    else {
                        flag = 'mod'
                        delText = condParser(tAttb.getIn(['template', 'template'], ''), currentVar, tAttb.getIn(['template', 'icon'], ''), parserOptions)
                    }
                }

                let group = tAttb.get('group', 'c1')
                tooltip.subAttributes.push({
                    text: text,
                    group: group,
                    flag: flag
                })

                if (delText) {
                    tooltip.subAttributes.push({
                        text: delText,
                        group: group,
                        flag: 'delete'
                    })
                }
            })
            currentSubAttributes.forEach((cAttb) => {
                let icon = cAttb.getIn(['template', 'icon'], '')

                if (icon != 'book' && icon != 'achievement') {
                    tooltip.subAttributes.push({
                        text: condParser(cAttb.getIn(['template', 'template'], ''), cAttb.get('var', Map()), icon, parserOptions),
                        group: cAttb.get('group', 'c1'),
                        flag: 'delete'
                    })
                }
            })

            if (current.has('info')) {
                tooltip.info = {
                    range: [current.getIn(['info', 'range'], -1), temp.getIn(['info', 'range'], -1)],
                    area: [current.getIn(['info', 'area'], Map()), temp.getIn(['info', 'area'], Map())],
                    cast: [current.getIn(['info', 'cast'], -1), temp.getIn(['info', 'cast'], -1)],
                    cooldown: [current.getIn(['info', 'cooldown'], -1), temp.getIn(['info', 'cooldown'], -1)]
                }
            }

            let currentTags = current.get('tags', List())
            let tempTags = temp.get('tags', List())
            tooltip.tags = tempTags

            currentTags.forEach(tag => {
                if (!tempTags.includes(tag)) {
                    tooltip.tags = tooltip.tags.push(tag.set('flag', 'disabled'))
                }
            })

            if (temp.has('locked')) {
                tooltip.locked = true
            }
        }
        else {
            tooltip.name = current.get('name', '')
            tooltip.pos = current.get('pos', '')
            tooltip.icon = current.get('icon', '')
            tooltip.focus = [current.get('focus', 0)]
            tooltip.element = []
            let elements = []
            tooltip.attributes = []
            current.get('attributes', List()).forEach((attb, key) => {
                let e = getElement(attb.getIn(['var', 'damage'], Map()), this.props.allTrees, this.props.allStatus)
                if (e && elements.indexOf(e) == -1) {
                    elements.push(e)
                    tooltip.element.push(<img key={`${e}_${key}`} className='element' src={elementImages[e]}/>)
                }

                tooltip.attributes.push({
                    text: stringParser(attb.get('template', ''), attb.get('var', Map()), parserOptions),
                    group: attb.get('group', 'sub'),
                    flag: ''
                })
            })
            if (current.has('info')) {
                tooltip.info = {
                    range: [current.getIn(['info', 'range'], -1)],
                    area: [current.getIn(['info', 'area'], Map())],
                    cast:[current.getIn(['info', 'cast'], -1)],
                    cooldown:[current.getIn(['info', 'cooldown'], -1)]
                }
            }

            tooltip.subAttributes = current.get('subAttributes', List()).map((attb) => {
                return {
                    text: condParser(attb.getIn(['template', 'template'], ''), attb.get('var', Map()), attb.getIn(['template', 'icon'], ''), parserOptions),
                    group: attb.get('group', 'c1'),
                    flag: ''
                }
            })

            tooltip.tags = current.get('tags', List())
        }

        let ts = ''
        let node = tooltip.pos
        if (node.length == 2) {
            ts = stringParser(this.props.tierStageTemp, Map({
                tier: node[0],
                stage: node[1]
            }))
        }

        let focus = null
        if (tooltip.focus.length == 2 && tooltip.focus[0] != tooltip.focus[1]) {
            let txt1 = `${tooltip.focus[0] > 0 ? this.props.uiText.get('focusRegen') : this.props.uiText.get('focusCost')} ${Math.abs(tooltip.focus[0])}`
            let txt2 = `${tooltip.focus[1] > 0 ? this.props.uiText.get('focusRegen') : this.props.uiText.get('focusCost')} ${Math.abs(tooltip.focus[1])}`

            if (tooltip.focus[0] > 0 && tooltip.focus[1] > 0 || tooltip.focus[0] < 0 && tooltip.focus[1] < 0) {
                txt2 = Math.abs(tooltip.focus[1])
            }

            let txt = ''
            if (tooltip.focus[0] == 0) {
                txt = <span className='mod'>{txt2}</span>
            }
            else if (tooltip.focus[1] == 0) {
                txt = <span>{txt1} <Icon type="caret-right" /> <span className='mod'>0</span></span>
            }
            else {
                txt = <span>{txt1} <Icon type="caret-right" /> <span className='mod'>{txt2}</span></span>
            }

            focus = txt
        }
        else if (tooltip.focus[0] != 0) {
            focus = `${tooltip.focus[0] >= 0 ? this.props.uiText.get('focusRegen') : this.props.uiText.get('focusCost')} ${Math.abs(tooltip.focus[0])}`
        }

        let attb = {
            m1: [],
            m2: [],
            sub: []
        }
        tooltip.attributes.forEach((a, key) => {
            let modTag = null
            if (a.flag == 'add' || a.flag == 'mod') {
                modTag = <span className={`modTag ${a.flag}`}>{this.props.uiText.get(a.flag)}</span>
            }
            attb[a.group].push(
                <p key={key} className={a.flag}>{a.text} {modTag}</p>
            )
        })

        let subAttb = {
            stanceChange: [],
            c1: [],
            c2: [],
            unlock: [],
            locked: null
        }
        tooltip.subAttributes.forEach((a, key) => {
            if (subAttb[a.group].length == 0) {
                let header = null
                if (a.group == 'c2') {
                    header = <h5 key={a.group}>{this.props.uiText.get(a.group)} <small>{this.props.uiText.get('c2info', '')}</small></h5>
                }
                else {
                    header = <h5 key={a.group}>{this.props.uiText.get(a.group, '')}</h5>
                }
                subAttb[a.group].push(header)
            }
            let modTag = null
            if ((a.flag == 'add' || a.flag == 'mod') && a.group != 'unlock') {
                modTag = <span className={`modTag ${a.flag}`}>{this.props.uiText.get(a.flag)}</span>
            }
            subAttb[a.group].push(
                <p key={key} className={a.flag}>{a.text} {modTag}</p>
            )
        })

        if (tooltip.locked) {
            subAttb.locked = <div className='locked'>
                <h5 key='locked'>{this.props.uiText.get('unreleased', '')}</h5>
                <p>"{this.props.uiText.get('unreleasedQuote', '')}"</p>
            </div>
        }

        let info = []
        if (tooltip.info) {
            info.push(infoBox(tooltip.info.range, this.props.uiText.get('range', 'Range'), this.props.uiText.get('zeroRange', ''), 'm'))

            let area = null
            let a1Type = tooltip.info.area[0].get('type', 0)
            let a1Value = tooltip.info.area[0].get('value', 0)
            if (tooltip.info.area.length > 1 && !tooltip.info.area[0].equals(tooltip.info.area[1])) {
                let a2Type = tooltip.info.area[1].get('type', 0)
                let a2Value = tooltip.info.area[1].get('value', 0)

                if (a1Type != a2Type) {
                    area =
                        <div className="info">
                            <div className={`area_${a1Type}`}>{a1Type == 0 ? this.props.uiText.get('zeroArea', '') : `${a1Value}m`}</div>
                            <Icon type="caret-down" />
                            <div className={`mod area_${a2Type}`}>{a2Type == 0 ? this.props.uiText.get('zeroArea', '') : `${a2Value}m`}</div>
                        </div>
                }
                else {
                    area =
                        <div className={`info area_${a1Type}`}>
                            <div>{a1Type == 0 ? this.props.uiText.get('zeroArea', '') : `${a1Value}m`}</div>
                            <Icon type="caret-down" />
                            <div className='mod'>{a2Type == 0 ? this.props.uiText.get('zeroArea', '') : `${a2Value}m`}</div>
                        </div>
                }
            }
            else {
                area =
                    <div className={`info area_${a1Type}`}>
                        <div>{a1Type == 0 ? this.props.uiText.get('zeroArea', '') : `${a1Value}m`}</div>
                    </div>
            }
            info.push(
                <div className="info-box" key='area'>
                    <div className="info-header">{this.props.uiText.get('area', '')}</div>
                    {area}
                </div>
            )

            info.push(infoBox(tooltip.info.cast, this.props.uiText.get('cast', 'Cast Time'), this.props.uiText.get('zeroTime', ''), this.props.uiText.get('timeUnit', ''), this.props.uiText.get('timeUnit2', '')))
            info.push(infoBox(tooltip.info.cooldown, this.props.uiText.get('cooldown', 'Cooldown'), this.props.uiText.get('zeroTime', ''), this.props.uiText.get('timeUnit', ''), this.props.uiText.get('timeUnit2', '')))
        }

        return (
            <div className='skillTooltip'>
                <div className='topBlock'>
                    <h3 className='name'>{tooltip.name}
                        <small className='classification'>{ts}</small>
                        <small>{tooltip.element}</small>
                    </h3>
                    <p className='focus'>{focus}</p>
                </div>
                <div className='mainBlock'>
                    <div>
                        <img className='icon' src={`/images/skill/${tooltip.icon}.png`}/>
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
                        {subAttb.c1}
                    </div>
                    <div className='cond2'>
                        {subAttb.c2}
                    </div>
                    <div className='unlock'>
                        {subAttb.unlock}
                    </div>
                    {subAttb.locked}
                </div>
                <TagList tags={tooltip.tags}/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillTooltip)
