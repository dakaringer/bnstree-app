import * as React from 'react'
import { ArrowRight } from '@material-ui/icons'
import classNames from 'classnames'
import T from '@src/components/T'

import * as style from './styles/index.css'

const Cost = (currentCost: number, hoverCost: number, type: 'focus' | 'health' = 'focus') => {
	const cost = type === 'focus' ? 'skill.general.cost_focus' : 'skill.general.cost_health'
	const regen = type === 'focus' ? 'skill.general.regen_focus' : 'skill.general.regen_health'

	if (currentCost === hoverCost) {
		if (hoverCost === 0) return null

		return (
			<span className={style.cost}>
				<T id={hoverCost > 0 ? regen : cost} values={{ value: Math.abs(hoverCost) }} />
			</span>
		)
	}

	if (currentCost === 0) {
		return (
			<span className={classNames(style.cost, style.mod)}>
				<T id={hoverCost > 0 ? regen : cost} values={{ value: Math.abs(hoverCost) }} />
			</span>
		)
	}

	if (currentCost * hoverCost >= 0) {
		return (
			<span className={style.cost}>
				<T id={hoverCost > 0 ? regen : cost} values={{ value: Math.abs(currentCost) }} />
				<ArrowRight />
				<span className={style.mod}>{Math.abs(hoverCost)}</span>
			</span>
		)
	}

	return (
		<span className={style.cost}>
			<T id={hoverCost > 0 ? regen : cost} values={{ value: Math.abs(currentCost) }} />
			<ArrowRight />
			<span className={style.mod}>
				<T id={hoverCost > 0 ? regen : cost} values={{ value: Math.abs(hoverCost) }} />
			</span>
		</span>
	)
}

export default Cost
