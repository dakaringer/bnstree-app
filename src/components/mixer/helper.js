import React from 'react'
import {List, fromJS} from 'immutable'
import {stringParser} from '../trainer2/parser'

export function generateSetEffect(index, equipped, data, templates, skillRef, uiText) {
    let statUp = []
    data.getIn(['setEffect', `s${index}`, 'stats'], List()).forEach(t => {
        statUp.push(
            `${uiText.get(t.get(0))} +${t.get(1)}${t.get(0) == 'criticalDamage' ? '%' : ''}`
        )
    })

    let skillEffects = []
    data.getIn(['setEffect', `s${index}`, 'skill'], List()).forEach((t, i) => {
        skillEffects.push(
            <p key={i}>{stringParser(t, templates, fromJS({skillRef: skillRef}))}</p>
        )
    })

    return(
        <div className={`setGroup ${equipped >= index ? 'active' : ''}`} key={`s${index}`}>
            <span className='setLabel'>{index}</span>
            <p>{statUp.join(', ')}</p>
            {skillEffects}
        </div>
    )
}
