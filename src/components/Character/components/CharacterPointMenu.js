import React from 'react'
import {translate} from 'react-i18next'

import attackImg from '../images/hm_attack.png'
import healthImg from '../images/hm_health.png'
import defenseImg from '../images/hm_defense.png'

const attack = {
    statTypes: ['attack_power_value', 'elementDamage'],
    m1: [attackImg, v => v],
    m2: [attackImg, v => v * 2],
    sub: [[60, 60], [40, 50], [20, 30], [10, 20]]
}

const defense = {
    statTypes: ['max_hp', 'defend_power_value'],
    m1: [healthImg, v => v * 250],
    m2: [defenseImg, v => v * 5],
    sub: [[20000, 105], [15000, 85], [10000, 45], [5000, 30]]
}

const CharacterPointMenu = props => {
    const {t, points, type} = props

    let stats = type === 'attack' ? attack : defense

    return (
        <div>
            <p>
                {t(`${type}Points`)} <span>{points}P</span>
            </p>
            <div className="mainHmStat">
                <img alt="stat1" src={stats.m1[0]} />
                <p>
                    {t(stats.statTypes[0])}
                    <span>
                        {stats.m1[1](points)}
                    </span>
                </p>
            </div>
            <div className="mainHmStat">
                <img alt="stat2" src={stats.m2[0]} />
                <p>
                    {t(stats.statTypes[1])}
                    <span>
                        {stats.m2[1](points)}
                    </span>
                </p>
            </div>
            <hr />
            <p>
                {t('additionalEffects')}
            </p>
            <table className="additionalEffects">
                <tbody>
                    <tr className={points >= 10 ? 'active' : ''}>
                        <th>10</th>
                        <td>
                            {t(stats.statTypes[0])} +{stats.sub[0][0]}, {t(stats.statTypes[1])} +{stats.sub[0][1]}
                        </td>
                    </tr>
                    <tr className={points >= 20 ? 'active' : ''}>
                        <th>20</th>
                        <td>
                            {t(stats.statTypes[0])} +{stats.sub[1][0]}, {t(stats.statTypes[1])} +{stats.sub[1][1]}
                        </td>
                    </tr>
                    <tr className={points >= 50 ? 'active' : ''}>
                        <th>50</th>
                        <td>
                            {t(`${type}50Effect`)}
                        </td>
                    </tr>
                    <tr className={points >= 80 ? 'active' : ''}>
                        <th>80</th>
                        <td>
                            {t(stats.statTypes[0])} +{stats.sub[2][0]}, {t(stats.statTypes[1])} +{stats.sub[2][1]}
                        </td>
                    </tr>
                    <tr className={points >= 100 ? 'active' : ''}>
                        <th>100</th>
                        <td>
                            {t(stats.statTypes[0])} +{stats.sub[3][0]}, {t(stats.statTypes[1])} +{stats.sub[3][1]}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default translate('character')(CharacterPointMenu)
