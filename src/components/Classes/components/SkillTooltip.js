import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map, List} from 'immutable'

import parser from '../parser'

import {Icon} from 'antd'

import {charSelector, skillNamesSelector, buildElementSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        element: buildElementSelector(state),
        characterData: charSelector(state),
        skillNames: skillNamesSelector(state)
    }
}

const SkillTooltip = props => {
    const {t, moveData, comparisonData, characterData, skillNames, element} = props

    //focus
    let focus = moveData.get('focus', moveData.get('health', 0))
    let compFocus = comparisonData.get('focus', comparisonData.get('health', 0))
    let focusTxt = focusHandler(focus, t, moveData.has('health'))
    if (focus !== compFocus) {
        if (compFocus !== 0) {
            if ((focus > 0 && compFocus > 0) || (focus < 0 && compFocus < 0) || focus === 0) {
                focusTxt = Math.abs(focus)
            }
            focusTxt = (
                <span>
                    {focusHandler(comparisonData.get('focus', 0), t)}
                    <Icon type="caret-right" />
                    <span className="mod">
                        {focusTxt}
                    </span>
                </span>
            )
        } else {
            focusTxt = (
                <span className="mod">
                    {focusTxt}
                </span>
            )
        }
    }

    //attributes
    let attributes = moveData.get('attributes', Map())
    let comparisonAttributes = comparisonData.get('attributes', Map())
    let attbList = {
        m1: [],
        m2: [],
        sub: []
    }
    attributes.forEach((group, type) => {
        group.forEach((attb, n) => {
            if (attb.get(2, element) === element) {
                let search = findAttb(attb, comparisonAttributes, element)
                let cAttb = search[0]
                comparisonAttributes = search[1]
                let flag = null
                let deleted = null
                if (!cAttb) {
                    flag = 'add'
                } else if (
                    !attb.get(1, Map()).equals(cAttb.get(1, Map())) &&
                    attb
                        .get(1, Map())
                        .delete('element')
                        .keySeq()
                        .equals(cAttb.get(1, Map()).delete('element').keySeq())
                ) {
                    flag = 'mod'

                    cAttb.get(1).forEach((v, k) => {
                        if (
                            attb.get(0, '').startsWith('damage') ||
                            (isNaN(v) && attb.getIn([1, k]) !== v)
                        ) {
                            deleted = parser(cAttb, element, characterData, skillNames)
                            return false
                        }
                    })
                }

                let tag = null
                if (flag) {
                    tag = (
                        <span className={`tag ${flag}`}>
                            {t(`tag-${flag}`)}
                        </span>
                    )
                }

                if (flag !== 'mod' || deleted) {
                    cAttb = null
                }

                attbList[type].push(
                    <p className={`attribute ${flag ? flag : ''}`} key={n}>
                        {parser(attb, element, characterData, skillNames, cAttb)} {tag}
                    </p>
                )

                if (deleted) {
                    attbList[type].push(
                        <p className="attribute delete" key={`mod-${n}`}>
                            {deleted}
                        </p>
                    )
                }
            }
        })
    })
    comparisonAttributes.forEach((group, type) => {
        group.forEach((attb, n) => {
            if (attb.get(2, element) === element) {
                attbList[type].push(
                    <p className="attribute delete" key={`del-${n}`}>
                        {parser(attb, element, characterData, skillNames)}
                    </p>
                )
            }
        })
    })

    //Info
    let info = moveData.getIn(['info', element], moveData.get('info', Map()))
    let comparisonInfo = comparisonData.getIn(['info', element], comparisonData.get('info', Map()))
    let infoList = {}
    comparisonInfo.forEach((i, type) => {
        let div = null
        if (type !== 'area') {
            let infoText = (
                <p>
                    {getInfoText(i, type, t)}
                </p>
            )

            let infoText2 = null
            if (info.get(type) !== i) {
                infoText2 = (
                    <p className="mod">
                        {getInfoText(info.get(type, 0), type, t)}
                    </p>
                )
            }

            div = (
                <div>
                    {infoText}
                    {infoText2 ? <Icon type="caret-down" /> : null}
                    {infoText2}
                </div>
            )
        } else {
            let areaType = i.get('type')
            let areaType2 = info.getIn([type, 'type'], 0)
            let areaValue = i.get('value')
            let areaValue2 = info.getIn([type, 'value'], 0)

            if (areaType !== areaType2) {
                div = (
                    <div className="info-data">
                        <div className={`area_${areaType}`}>
                            {getInfoText(areaValue, type, t)}
                        </div>
                        <Icon type="caret-down" />
                        <div className={`mod area_${areaType2}`}>
                            {getInfoText(areaValue2, type, t)}
                        </div>
                    </div>
                )
            } else if (areaValue !== areaValue2) {
                div = (
                    <div className={`info-data area_${areaType}`}>
                        <div>
                            {getInfoText(areaValue, type, t)}
                        </div>
                        <Icon type="caret-down" />
                        <div className={`mod`}>
                            {getInfoText(areaValue2, type, t)}
                        </div>
                    </div>
                )
            } else {
                div = (
                    <div className={`info-data area_${areaType}`}>
                        <div>
                            {getInfoText(areaValue, type, t)}
                        </div>
                    </div>
                )
            }
        }
        infoList[type] = (
            <div className="info-box">
                <div className="info-header">
                    {t(type)}
                </div>
                <div className="info-data">
                    {div}
                </div>
            </div>
        )
    })

    //subAttributes
    let subAttributes = moveData.get('subAttributes', Map())
    let comparisonSubAttributes = comparisonData.get('subAttributes', Map())
    let subAttbList = {
        stanceChange: [],
        condition: [],
        unlock: []
    }

    subAttributes.forEach((group, type) => {
        group.forEach((pair, n) => {
            let attb = pair.get('text')

            if (attb.get(2, element) === element) {
                let search = findAttb(attb, comparisonSubAttributes, element, true)
                let cAttb = search[0]
                comparisonSubAttributes = search[1]

                let flag = null
                if (type !== 'unlock') {
                    if (!cAttb) {
                        flag = 'add'
                    } else if (
                        !attb.get(1, Map()).equals(cAttb.get(1, Map())) &&
                        attb
                            .get(1, Map())
                            .delete('element')
                            .keySeq()
                            .equals(cAttb.get(1, Map()).delete('element').keySeq())
                    ) {
                        flag = 'mod'
                    }
                }

                let tag = null
                if (flag) {
                    tag = (
                        <span className={`tag ${flag}`}>
                            {t(`tag-${flag}`)}
                        </span>
                    )
                }

                let icon = pair.get('icon', 'buff_debuff_icon_08_53')
                if (type === 'unlock') {
                    icon = 'achievement'
                }
                subAttbList[type].push(
                    <p className={`attribute ${flag ? flag : ''}`} key={n}>
                        <img alt={type} src={`https://static.bnstree.com/images/skill/${icon}`} />
                        <span>
                            {parser(attb, element, characterData, skillNames)} {tag}
                        </span>
                    </p>
                )

                if (flag === 'mod') {
                    let icon2 = search[0].get('icon', 'buff_debuff_icon_08_53')
                    subAttbList[type].push(
                        <p className="attribute delete" key={`mod-${n}`}>
                            <img
                                alt={type}
                                src={`https://static.bnstree.com/images/skill/${icon2}`}
                            />
                            <span>
                                {parser(cAttb, element, characterData, skillNames)}
                            </span>
                        </p>
                    )
                }
            }
        })
    })
    comparisonSubAttributes.forEach((group, type) => {
        if (type !== 'unlock') {
            group.forEach((pair, n) => {
                let attb = pair.get('text')
                if (attb.get(2, element) === element) {
                    let icon = pair.get('icon', 'buff_debuff_icon_08_53')
                    subAttbList[type].push(
                        <p className="attribute delete" key={`del-${n}`}>
                            <img
                                alt={type}
                                src={`https://static.bnstree.com/images/skill/${icon}`}
                            />
                            <span>
                                {parser(attb, element, characterData, skillNames)}
                            </span>
                        </p>
                    )
                }
            })
        }
    })

    //tags
    let tags = []
    let disabledTags = []
    moveData.get('tags', List()).forEach(tag => {
        tags.push(
            <div className="skillTag" key={tag}>
                {t(`TAG_${tag}`)}
            </div>
        )
    })
    comparisonData.get('tags', List()).forEach(tag => {
        if (!moveData.get('tags', List()).includes(tag)) {
            disabledTags.push(
                <div className="skillTag disabled" key={tag}>
                    {t(`TAG_${tag}`)}
                </div>
            )
        }
    })

    let moveNumber = moveData.get('move')
    let classification =
        moveNumber > 3 ? t('moveTypeHM', {move: moveNumber - 3}) : t('moveType', {move: moveNumber})

    let buildStat = null
    if (moveData.has('buildStat')) {
        let stat = moveData.get('buildStat')
        let total = stat.get('total', 0)
        let _PvE = (total === 0 ? 0 : stat.get('PvE', 0) / total * 100).toFixed(2)
        let _PvP = (total === 0 ? 0 : stat.get('PvP', 0) / total * 100).toFixed(2)
        let _6v6 = (total === 0 ? 0 : stat.get('6v6', 0) / total * 100).toFixed(2)
        buildStat = (
            <div className="skill-build-stat">
                <hr />
                <p>
                    {t('buildStat')}
                </p>
                <div className="stat-bar">
                    <div className="section-PvE bar-section" style={{width: `${_PvE}%`}}>
                        {t('PvE')} <small>{_PvE}%</small>
                    </div>
                    <div className="section-PvP bar-section" style={{width: `${_PvP}%`}}>
                        {t('PvP')} <small>{_PvP}%</small>
                    </div>
                    <div className="section-6v6 bar-section" style={{width: `${_6v6}%`}}>
                        {t('6v6')} <small>{_6v6}%</small>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="skill-tooltip">
            <div className="tooltip-header">
                <h2 className="skill-name">
                    {moveData.get('name')} <small>{classification}</small>
                </h2>
                <p className="skill-focus">
                    {focusTxt}
                </p>
            </div>
            <div className="tooltip-main-block">
                <img
                    className="tooltip-icon"
                    alt={moveData.get('skillId')}
                    src={`https://static.bnstree.com/images/skill/${moveData.get('icon', 'blank')}`}
                />
                <div>
                    <div className="tooltip-m1">
                        {attbList.m1}
                    </div>
                    <div className="tooltip-m2">
                        {attbList.m2}
                    </div>
                </div>
            </div>
            <div className="tooltip-sub-block">
                {attbList.sub}
            </div>
            <div className="tooltip-info-block">
                {infoList.range}
                {infoList.area}
                {infoList.cast}
                {infoList.cooldown}
            </div>
            <div className="tooltip-subAttribute-block">
                <div className="subAttribute-group condition">
                    {subAttbList.condition.length > 0
                        ? <h4>
                              {t('condition')}
                          </h4>
                        : null}
                    {subAttbList.condition}
                </div>
                <div className="subAttribute-group stance">
                    {subAttbList.stanceChange.length > 0
                        ? <h4>
                              {t('stanceChange')}
                          </h4>
                        : null}
                    {subAttbList.stanceChange}
                </div>
                <div className="subAttribute-group unlock">
                    {subAttbList.unlock.length > 0
                        ? <h4>
                              {t('unlock')}
                          </h4>
                        : null}
                    {subAttbList.unlock}
                </div>
            </div>
            <div className="tooltip-tag-block">
                {tags}
                {disabledTags}
            </div>
            {buildStat}
        </div>
    )
}

export default connect(mapStateToProps)(translate(['skills', 'tooltip'])(SkillTooltip))

function focusHandler(value, t, health) {
    if (value !== 0) {
        if (!health) {
            return value > 0
                ? t('focusRegen', {focus: value})
                : t('focusCost', {focus: Math.abs(value)})
        } else {
            return t('healthCost', {value: value})
        }
    } else {
        return null
    }
}

function findAttb(attb, list, element, sub = false) {
    let cAttb = null
    list.forEach((group, type) => {
        group.forEach((c, i) => {
            if (sub) {
                c = c.get('text')
            }
            let includeCheck = group.includes(attb) && attb.equals(c)
            let sameKeySeqCheck =
                attb.get(0) === c.get(0) &&
                attb
                    .get(1, Map())
                    .delete('element')
                    .keySeq()
                    .equals(c.get(1, Map()).delete('element').keySeq())
            let sameStatusCheck = List.isList(attb.getIn([1, 'status']))
                ? attb.getIn([1, 'status']).equals(c.getIn([1, 'status']))
                : attb.getIn([1, 'status']) === c.getIn([1, 'status'])
            let sameStatCheck = List.isList(attb.getIn([1, 'stat']))
                ? attb.getIn([1, 'stat']).equals(c.getIn([1, 'stat']))
                : attb.getIn([1, 'stat']) === c.getIn([1, 'stat'])
            let sameSkillCheck = List.isList(attb.getIn([1, 'skill']))
                ? attb.getIn([1, 'skill']).equals(c.getIn([1, 'skill']))
                : attb.getIn([1, 'skill']) === c.getIn([1, 'skill'])
            let elementCheck = attb.get(2, element) === c.get(2, element)
            if (
                elementCheck &&
                (includeCheck ||
                    (sameKeySeqCheck && sameStatusCheck && sameStatCheck && sameSkillCheck))
            ) {
                cAttb = c
                list = list.deleteIn([type, i])
                return false
            }
        })
        if (cAttb) {
            return false
        }
    })
    return [cAttb, list]
}

function getInfoText(value, type, t) {
    if (value === 0) {
        if (type === 'cast' || type === 'cooldown') {
            return t('time-zero')
        } else {
            return t(`${type}-zero`)
        }
    } else {
        if (type === 'cast' || type === 'cooldown') {
            let min = Math.floor(value / 60)
            let sec = value % 60
            let minText = min > 0 ? t('time-min', {min: min}) : ''
            let secText = sec > 0 ? t('time-sec', {sec: sec}) : ''

            return `${minText} ${secText}`
        } else {
            return `${value}m`
        }
    }
}
