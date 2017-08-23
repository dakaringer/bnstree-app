import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map, List} from 'immutable'
import parser from '../parser'

import pieceImages from '../images/map_pieceImg'
import {skillNamesSelector} from '../selectors'

import {Collapse, Row, Col} from 'antd'
const Panel = Collapse.Panel

const trigram = ['☵', '☶', '☳', '☴', '☲', '☷', '☱', '☰']

const statOrder = [
    'attack_critical_value',
    'attack_critical_damage_value',
    'attack_hit_value',
    'max_hp',
    'defend_power_value',
    'defend_dodge_value',
    'defend_parry_value',
    'defend_critical_value'
]

const mapStateToProps = state => {
    return {
        skillNames: skillNamesSelector(state)
    }
}

class SoulshieldListItem extends React.Component {
    render() {
        const {t, set, skillNames} = this.props

        let effects = []
        set.get('effects', List()).forEach((set, i) => {
            let label = 3 * (i + 1) - (i !== 0 ? 1 : 0)
            let attributes = []
            set.forEach((attribute, j) => {
                let text = ''
                if (attribute.get(0) === 'stats') {
                    text = attribute
                        .get(1)
                        .map(
                            stat =>
                                `${t(stat.get(0))} ${stat.get(1)}${stat.get(0) ===
                                'attack_critical_damage_value'
                                    ? '%'
                                    : ''}`
                        )
                        .join(', ')
                } else {
                    text = parser(attribute, null, null, skillNames)
                }

                attributes.push(
                    <p className="attribute" key={j}>
                        {text}
                    </p>
                )
            })

            effects.push(
                <div className="set-effect" key={label}>
                    <div className="set-label">
                        {label}
                    </div>
                    <div>
                        {attributes}
                    </div>
                </div>
            )
        })

        let pieces = []
        set.get('stats', List()).forEach((piece, i) => {
            let m1Mod = [0, 0]
            if (piece.getIn(['m2', 'stat']) === 'max_hp') {
                m1Mod[0] = piece.getIn(['m2', 'values', 0]) * 10
                m1Mod[1] = piece.getIn(['m2', 'values', 1]) * 10
            }

            let m2 =
                piece.has('m2') && piece.getIn(['m2', 'stat']) !== 'max_hp'
                    ? `${t(piece.getIn(['m2', 'stat']))}
                       ${piece.getIn(['m2', 'values', 0])}~${piece.getIn(['m2', 'values', 1])}`
                    : null

            let sub = []
            let subDiv = null
            let subStats = piece.get('sub', Map())
            subStats
                .get('stats', List())
                .sort((a, b) => statOrder.indexOf(a) - statOrder.indexOf(b))
                .forEach(stat => {
                    let mod = stat === 'max_hp' ? 10 : 1

                    let values = subStats.get(
                        stat === 'max_hp' && subStats.has('healthValues')
                            ? 'healthValues'
                            : 'values',
                        Map()
                    )

                    sub.push(
                        <div key={stat}>
                            {t(stat)} {values.get(0) * mod}~{values.get(1) * mod}
                            <span className={`tag rng`}>%</span>
                        </div>
                    )
                })
            if (sub.length > 0) {
                subDiv = (
                    <div className="sub">
                        <p>
                            {t('skills:randomSub', {count: subStats.get('limit', 1)})}
                        </p>
                        <div>
                            {sub}
                        </div>
                    </div>
                )
            }

            pieces.push(
                <Row
                    className="soulshield-piece"
                    key={i}
                    gutter={16}
                    type="flex"
                    justify="space-between"
                    align="center">
                    <Col sm={12} className="soulshield-piece-name">
                        <img alt={i + 1} src={pieceImages[`p${i + 1}`]} />
                        <p className={`grade_${set.get('grade')}`}>
                            {set.get('name')} {trigram[i]}
                            {i + 1}
                        </p>
                    </Col>
                    <Col sm={12} className="soulshield-piece-stat">
                        <div>
                            <div className="m1">
                                {t('max_hp')} {piece.getIn(['m1', 0]) + m1Mod[0]}~{piece.getIn(['m1', 1]) + m1Mod[1]}
                            </div>
                            <div className="m2">
                                {m2}
                            </div>
                        </div>
                        {subDiv}
                        <div className="maxFuse">
                            {t('skills:maxFuse')}: {piece.get('maxFuse')}
                        </div>
                    </Col>
                </Row>
            )
        })

        return (
            <div className="item-list-item soulshield-item">
                <Collapse bordered={false}>
                    <Panel
                        header={
                            <div className="item-header">
                                <img
                                    className="item-icon"
                                    alt={set.get('name')}
                                    src={`https://static.bnstree.com/images/soulshields/sets/${set.get(
                                        'icon',
                                        'blank'
                                    )}`}
                                />
                                <div>
                                    <h3 className={`grade_${set.get('grade')}`}>
                                        {set.get('name')}
                                    </h3>
                                    <div className="set-name">
                                        {t(`skills:${set.get('group')}`)}
                                    </div>
                                </div>
                            </div>
                        }>
                        <div className="set-effects">
                            <h5 className="set-effect-name">
                                {set.get('setEffect')}
                            </h5>
                            {effects}
                        </div>
                        <Collapse bordered={false}>
                            <Panel
                                className="soulshield-pieces"
                                header={
                                    <div className="item-header">
                                        {t('skills:stats')}
                                    </div>
                                }>
                                <div>
                                    {pieces}
                                </div>
                            </Panel>
                        </Collapse>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}

export default connect(mapStateToProps)(translate(['character', 'skills'])(SoulshieldListItem))
