import React from 'react'
import { ArrowRight } from '@material-ui/icons'

import T from '@components/T'
import ModText from '@components/ModText'

import { TooltipCost } from './style'

const Cost = (currentCost: number, hoverCost: number, type: 'focus' | 'health' = 'focus') => {
	const cost = type === 'focus' ? 'skill.general.cost_focus' : 'skill.general.cost_health'
	const regen = type === 'focus' ? 'skill.general.regen_focus' : 'skill.general.regen_health'

	if (currentCost === hoverCost) {
		if (hoverCost === 0) {
			return null
		}

		return (
			<TooltipCost>
				<T id={hoverCost > 0 ? regen : cost} values={{ value: Math.abs(hoverCost) }} />
			</TooltipCost>
		)
	}

	if (currentCost === 0) {
		return (
			<TooltipCost flag="mod">
				<T id={hoverCost > 0 ? regen : cost} values={{ value: Math.abs(hoverCost) }} />
			</TooltipCost>
		)
	}

	if (currentCost * hoverCost >= 0) {
		return (
			<TooltipCost>
				<T id={hoverCost > 0 ? regen : cost} values={{ value: Math.abs(currentCost) }} />
				<ArrowRight />
				<ModText flag="mod">{Math.abs(hoverCost)}</ModText>
			</TooltipCost>
		)
	}

	return (
		<TooltipCost>
			<T id={hoverCost > 0 ? regen : cost} values={{ value: Math.abs(currentCost) }} />
			<ArrowRight />
			<TooltipCost flag="mod">
				<T id={hoverCost > 0 ? regen : cost} values={{ value: Math.abs(hoverCost) }} />
			</TooltipCost>
		</TooltipCost>
	)
}

export default Cost
