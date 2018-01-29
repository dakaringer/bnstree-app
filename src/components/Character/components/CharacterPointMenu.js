import React from 'react'
import { translate } from 'react-i18next'

import attackImg from '../images/hm_attack.png'
import healthImg from '../images/hm_health.png'
import defenseImg from '../images/hm_defense.png'

const steps = [10, 20, 50, 80, 100, 115, 125]

const attack = {
    statTypes: ['attack_power_value', 'elementDamage'],
    m1: [attackImg, v => v],
    m2: [attackImg, v => v * 2],
    sub: [[60, 60], [40, 50], 'attack50Effect', [20, 30], [15, 20], [10, 15], 'attack125Effect']
}

const defense = {
    statTypes: ['max_hp', 'defend_power_value'],
    m1: [healthImg, v => v * 250],
    m2: [defenseImg, v => v * 5],
    sub: [[20000, 150], [15000, 120], 'defense50Effect', [10000, 90], [6000, 60], [4000, 45], 'defense125Effect']
}

const CharacterPointMenu = props => {
    const { t, points, type } = props

    let stats = type === 'attack' ? attack : defense

    let additionalEffects = []
    steps.forEach((step, i) => {
        let effect = null
        if (typeof stats.sub[i] === 'string') {
            effect = t(stats.sub[i])
        }
        else {
            effect = `${t(stats.statTypes[0])} +${stats.sub[i][0]}, ${t(stats.statTypes[1])} +${stats.sub[i][1]}`
        }

        additionalEffects.push(
            <tr className={points >= step ? 'active' : ''} key={step}>
                <th>{step}</th>
                <td>
                    {effect}
                </td>
            </tr>
        )
    })

    return (
        <div>
            <h4>
                {t(`${type}Points`)} <span>{points}P</span>
            </h4>
            <div className="mainHmStat">
                <img alt="stat1" src={stats.m1[0]} />
                <p>
                    {t(stats.statTypes[0])}
                    <span>{stats.m1[1](points)}</span>
                </p>
            </div>
            <div className="mainHmStat">
                <img alt="stat2" src={stats.m2[0]} />
                <p>
                    {t(stats.statTypes[1])}
                    <span>{stats.m2[1](points)}</span>
                </p>
            </div>
            <hr />
            <h4>{t('additionalEffects')}</h4>
            <table className="additionalEffects">
                <tbody>
                    {additionalEffects}
                </tbody>
            </table>
        </div>
    )
}

export default translate('character')(CharacterPointMenu)
