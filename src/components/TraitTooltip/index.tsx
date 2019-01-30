import React from 'react'
import { Typography } from '@material-ui/core'

import HoverTooltip from '@components/HoverTooltip'
import SkillName from '@components/SkillName'
import T from '@components/T'
import TraitTooltipSkill from './TraitTooltipSkill'

import { SkillSpecialization, ClassCode } from '@store'
import { Trait } from '@store/Skills'

interface Props {
	trait: DeepReadonly<Trait>
	specialization: SkillSpecialization<ClassCode>
	target: React.ReactElement<any>
}

const TraitTooltip: React.FC<Props> = props => {
	const { trait, specialization, ...tooltipProps } = props

	return (
		<HoverTooltip
			button
			title={<SkillName name={trait.data.name} variant="subtitle1" />}
			sub={
				<Typography variant="caption" color="secondary">
					<T id="skill.trait.tooltip" />
				</Typography>
			}
			extra={trait.data.skills.map((skill, i) => (
				<TraitTooltipSkill key={i} traitSkill={skill} specialization={specialization} />
			))}
			{...tooltipProps}
		/>
	)
}

export default TraitTooltip
