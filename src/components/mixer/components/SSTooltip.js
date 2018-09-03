import React from 'react'
import {connect} from 'react-redux'
import {Map, List, fromJS} from 'immutable'
import {generateSetEffect} from '../helper'

import {uiTextSelector,
    dataSelector,
    skillSelector,
    templateSelector,
    locationSelector,
    equipDataSelector,
    statOrder} from '../selector'
import {currentLanguageSelector} from '../../../selector'
import {stringParser} from '../../trainer2/parser'

import locImg from '../images/map_locationImg'
import bg_gem from '../images/bg_gem.png'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('SS_TOOLTIP', Map()),
        classNames: uiTextSelector(state).get('CLASS_NAMES', Map()),
        skillRef: skillSelector(state),
        templates: templateSelector(state),
        locale: currentLanguageSelector(state),
        locations: locationSelector(state),
        equippedPieces: equipDataSelector(state),
        allSets: dataSelector(state)
    }
}

const trigram = [
    '☵',
    '☶',
    '☳',
    '☴',
    '☲',
    '☷',
    '☱',
    '☰'
]

const SSTooltip = (props) => {
    let data = props.tooltipData
    let pieceData = data.getIn(['pieceData', `p${props.piece}`], Map())
    let equipData = props.equipData

    let slideControl = data.get('grade') == 7 || data.get('evolve')

    let m1 = null
    let m2 = null
    let sub = []
    let comparison = null
    if (equipData && equipData.get('id') == props.id) {
        let m1Max = pieceData.get('m1', List([0])).sort().last()
        let m2Max = pieceData.getIn(['m2', 'values'], List([0])).sort().last()
        let m1Value = equipData.get('m1Value', m1Max)
        let m2Value = equipData.get('m2Value', m2Max)

        let stat2 = pieceData.getIn(['m2', 'stat'])
        if (stat2 == 'health') {
            m1Max += m2Max * 10
            m1Value += m2Value * 10
            m2Value = 0
        }

        let subStats = equipData.get('sub', List())
        let usedStats = [stat2]
        subStats.forEach(stat => {
            let max = pieceData.getIn(['sub', 'values'], List([0])).sort().last()
            if (stat.get(0) == 'health') {
                max = pieceData.getIn(['sub', 'healthValues'], max).sort().last() * 10
            }

            sub.push(
                generateStatText(stat.get(0),
                    stat.get(0) != 'health' ? stat.get(1) : stat.get(1) * 10,
                    stat.get(0) != 'health' ? equipData.get('fuse', Map()) : Map(),
                    props.uiText,
                    slideControl ? max : 0
                )
            )
            usedStats.push(stat.get(0))
        })

        if (usedStats.indexOf(equipData.getIn(['fuse', 'stat'])) < 0) {
            sub.push(
                generateStatText(equipData.getIn(['fuse', 'stat']), 0, equipData.get('fuse'), props.uiText, 0)
            )
        }

        m1 = generateStatText('health', m1Value, equipData.get('fuse'), props.uiText, slideControl ? m1Max : 0)
        m2 = generateStatText(stat2, m2Value, equipData.get('fuse'), props.uiText, slideControl ? m2Max : 0)
    }
    else {
        let m1Values = pieceData.get('m1', List()).sort()
        let m2Values = pieceData.getIn(['m2', 'values'], List()).sort()
        let subValues = pieceData.getIn(['sub', 'values'], List()).sort()

        let stat2 = pieceData.getIn(['m2', 'stat'])
        if (stat2 == 'health') {
            m2Values.forEach((v, i) => {
                m1Values = m1Values.set(i, m1Values.get(i) + v * 10)
            })
            stat2 = null
        }

        let m1Text = null
        let m2Text = null
        let subText = null
        if (slideControl) {
            m1Text = `${m1Values.get(0, 0)}~${m1Values.get(1, 0)}`
            m2Text = `${m2Values.get(0, 0)}~${m2Values.get(1, 0)}`
            subText = `${subValues.get(0, 0)}~${subValues.get(1, 0)}`
        }
        else {
            m1Text = m1Values.join(', ')
            m2Text = m2Values.join(', ')
            subText = subValues.join(', ')
        }

        m1 = <p>{props.uiText.get('health')} {m1Text}</p>
        if (stat2) {
            m2 = <p>{props.uiText.get(stat2)} {m2Text}</p>
        }

        if (pieceData.hasIn(['sub', 'limit'])) {
            sub.push(
                <p key='text' className='desc'>
                    {stringParser(fromJS({template: 'subLimit', variables: {limit: pieceData.getIn(['sub', 'limit'])}}), props.uiText)}
                </p>
            )
        }
        let orderedSub = pieceData.getIn(['sub', 'stats']).sort((a, b) => {
            return statOrder.indexOf(a) - statOrder.indexOf(b)
        })

        orderedSub.forEach(stat => {
            if (stat == 'health') {
                let healthValues = pieceData.getIn(['sub', 'healthValues'], subValues).sort()
                sub.push (
                    <p key={stat}>{props.uiText.get(stat)} {healthValues.get(0, 0) * 10}~{healthValues.get(1, 0) * 10}</p>
                )
            }
            else {
                sub.push(
                    <p key={stat}>{props.uiText.get(stat)} {subText}</p>
                )
            }
        })

        if (equipData) {
            let equippedPieceData = props.allSets.getIn([equipData.get('id'), 'pieceData', `p${props.piece}`], Map())
            let m1Lower = m1Values.first() - equipData.get('m1Value')
            let m1Upper = m1Values.last() - equipData.get('m1Value')

            let m1Comparison = generateComparisonText(m1Lower, m1Upper, props.uiText.get('health'))

            let m2Comparison = null
            if (stat2 && equippedPieceData.hasIn(['m2', 'stat']) && stat2 == equippedPieceData.getIn(['m2', 'stat'])) {
                let m2Lower = m2Values.first() - equipData.get('m2Value')
                let m2Upper = m2Values.last() - equipData.get('m2Value')

                m2Comparison = generateComparisonText(m2Lower, m2Upper, props.uiText.get(stat2))
            }
            else if (equippedPieceData.has('m2') && equippedPieceData.getIn(['m2', 'stat']) != 'health') {
                let m2New = null

                if (stat2) {
                    m2New = <p className='comparison add'>{props.uiText.get(stat2)} {m2Values.first()}~{m2Values.last()}</p>
                }
                m2Comparison = <div>
                    {m2New}
                    <p className='comparison delete'>{props.uiText.get(equippedPieceData.getIn(['m2', 'stat']))} {equipData.get('m2Value')}</p>
                </div>
            }

            let subComparison = []
            if (pieceData.hasIn(['sub', 'limit'])) {
                subComparison.push(
                    <p key='text' className='desc'>
                        {stringParser(fromJS({template: 'subLimit', variables: {limit: pieceData.getIn(['sub', 'limit'])}}), props.uiText)}
                    </p>
                )
            }
            orderedSub.forEach(stat => {
                let equippedValue = null
                equipData.get('sub').forEach(tuple => {
                    if (tuple.get(0) == stat) {
                        equippedValue = tuple.get(1)
                        return false
                    }
                })

                if (equippedValue) {
                    let subLower = subValues.first() - equippedValue
                    let subUpper = subValues.last() - equippedValue
                    if (stat == 'health') {
                        subLower = subLower * 10
                        subUpper = subUpper * 10
                    }

                    subComparison.push(generateComparisonText(subLower, subUpper, props.uiText.get(stat)))
                }
                else {
                    if (stat == 'health') {
                        let healthValues = pieceData.getIn(['sub', 'healthValues'], subValues).sort()
                        subComparison.push(
                            <p key={stat} className='comparison'>{props.uiText.get(stat)} {healthValues.get(0, 0) * 10}~{healthValues.get(1, 0) * 10}</p>
                        )
                    }
                    else {
                        subComparison.push(
                            <p key={stat} className='comparison'>{props.uiText.get(stat)} {subValues.first()}~{subValues.last()}</p>
                        )
                    }
                }
            })
            equipData.get('sub').forEach(tuple => {
                if (!pieceData.getIn(['sub', 'stats'], List()).includes(tuple.get(0))) {
                    subComparison.push(
                        <p key={tuple.get(0)} className='comparison delete'>{props.uiText.get(tuple.get(0))} {tuple.get(1)}</p>
                    )
                    return false
                }
            })

            comparison =
                <div className='compare'>
                    <hr/>
                    <h6 className={`grade_${props.allSets.getIn([equipData.get('id'), 'grade'])}`}>
                        {props.allSets.getIn([equipData.get('id'), 'name'])} {trigram[props.piece - 1]}{props.piece}
                    </h6>
                    {m1Comparison}
                    {m2Comparison}
                    {subComparison}
                </div>
        }
    }

    let maxSet = 0
    let setPieces = []
    let setEffects = []
    let pieceLabels = []
    props.equippedPieces.forEach((v, k) => {
        let number = k.charAt(1)
        let equipGrade = ''
        if (v && v.get('setId') == data.get('setId')) {
            equipGrade = v.get('equipGrade')
            setPieces.push(
                <img key={k} className={`piece ${k}`} src={`/images/soulshield/pieces/equipgem_${data.get('iconPrefix')}_extra_pos${k.charAt(1)}.png`}/>
            )
        }
        pieceLabels.push(
            <p key={k} className={`grade_${equipGrade}`}>{props.uiText.get('soulshield')} {trigram[number - 1]}{number}</p>
        )
    })

    if (data.hasIn(['setEffect', 's3'])) {
        maxSet = 3
        setEffects.push(generateSetEffect(3, setPieces.length, data, props.templates, props.skillRef, props.uiText))
    }
    if (data.hasIn(['setEffect', 's5'])) {
        maxSet = 5
        setEffects.push(generateSetEffect(5, setPieces.length, data, props.templates, props.skillRef, props.uiText))
    }
    if (data.hasIn(['setEffect', 's8'])) {
        maxSet = 8
        setEffects.push(generateSetEffect(8, setPieces.length, data, props.templates, props.skillRef, props.uiText))
    }


    let acquire = []
    pieceData.get('acquire', data.get('acquire', List())).forEach(loc => {
        acquire.push(
            <p key={loc}><img className='icon' src={locImg[props.locations.getIn([loc, 'icon'])]}/> {props.locations.getIn([loc, 'name'])}</p>
        )
    })

    let flavor = null
    if (data.has('flavor')) {
        flavor = <div>
            <hr/>
            <p className='flavor'>"{data.get('flavor')}"</p>
        </div>
    }

    let classRestriction = null
    if (data.has('classRestriction')) {
        classRestriction = <p>
            {stringParser(fromJS({template: 'classRestriction', variables: {className: props.classNames.get(data.get('classRestriction'))}}), props.uiText)}
        </p>
    }

    return (
        <div className='ssTooltip'>
            <div className='topBlock'>
                <h3 className={`name grade_${data.get('grade')}`}>
                    {data.get('name')} {trigram[props.piece - 1]}{props.piece}
                </h3>
                <p className='equipped'>{equipData && equipData.get('id') == props.id ? props.uiText.get('equipped') : ''}</p>
            </div>
            <div className='mainBlock'>
                <div>
                    <img className='icon' src={`/images/soulshield/pieces/equipgem_${data.get('iconPrefix')}_pos${props.piece}_${data.get('grade')}_1.png`}/>
                </div>
                <div className='mainAttb'>
                    <div className='m1'>
                        {m1}
                    </div>
                    <div className='m2'>
                        {m2}
                    </div>
                    <div className='sub'>
                        {sub}
                    </div>
                </div>
            </div>
            <hr/>
            <div className='subBlock'>
                <p>{props.uiText.get('maxFuse')}: <span className='fuse'>{pieceData.get('maxFuse')}</span></p>
                <hr/>
                <div className='setEffect'>
                    <p>{data.get('effectName')} ({setPieces.length}/{maxSet})</p>
                    <div className='setPreview'>
                        <div className='imagePreview'>
                            {setPieces}
                            <img className='setBackground' src={bg_gem}/>
                        </div>
                        <div className='labels'>
                            {pieceLabels}
                        </div>
                    </div>
                    <h6>{props.uiText.get('setEffect')}</h6>
                    {setEffects}
                </div>
                <hr/>
                <div className='acquire'>
                    <h6>{props.uiText.get('acquire')}</h6>
                    {acquire}
                </div>
                {flavor}
                <hr/>
                <div className='info'>
                    <p>{props.uiText.get(`p${props.piece}`)}{props.piece}</p>
                    <p>{stringParser(fromJS({template: 'levelReq', variables: {level: data.get('level')}}), props.uiText)}</p>
                    {classRestriction}
                    <p>{props.uiText.get('bind')}</p>
                </div>
                {comparison}
            </div>
        </div>
    )
}

function generateStatText(stat, value, fuseData, uiText, max=0) {
    let fuse = 0
    if (stat != 'none' && fuseData && fuseData.get('stat') == stat) {
        fuse = fuseData.get('value', 0) * (stat == 'health' ? 10 : 1)
    }

    let total = value + fuse
    if (total > 0) {
        let fuseText = null
        if (total != value) {
            fuseText = <span>({value} + <span className='fuse'>{fuse}</span>)</span>
        }

        let m = null
        if (max > 0) {
            let mPlus = null
            if (total != value) {
                mPlus = <span> + <span className='fuse'>{fuse}</span></span>
            }
            m = <span className='max'>{uiText.get('max')} {max}{mPlus}</span>
        }

        return (
            <p key={stat}>{uiText.get(stat)} <span className={total != value ? 'fuse' : ''}>{total}</span> {fuseText} {m}</p>
        )
    }
    return null
}

function generateComparisonText(lower, upper, stat) {
    return (<p key={stat} className='comparison'>
        {stat} <span className={`${lower > 0 ? 'positive' : ''} ${lower < 0 ? 'negative' : ''}`}>
            {lower > 0 ? '+' : ''}{lower}
        </span>~<span className={`${upper > 0 ? 'positive' : ''} ${upper < 0 ? 'negative' : ''}`}>
            {upper > 0 ? '+' : ''}{upper}
        </span>
    </p>)
}

export default connect(mapStateToProps)(SSTooltip)
