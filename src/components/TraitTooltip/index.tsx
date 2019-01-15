import * as React from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'

import HoverTooltip from '@components/HoverTooltip'
import SkillName from '@components/SkillName'
import T from '@components/T'
import TraitTooltipSkill from './components/TraitTooltipSkill'

import { SkillSpecialization, ClassCode } from '@store/constants'
import { RootState } from '@store/rootReducer'
import { Trait } from '@store/Skills/types'
import { getResource } from '@store/Resources/selectors'
import { getLocale } from '@store/Intl/selectors'

interface Props {
	trait: DeepReadonly<Trait>
	specialization: SkillSpecialization<ClassCode>
	target: React.ReactElement<any>
}

const TraitTooltip: React.SFC<Props> = props => {
	const { trait, specialization, ...tooltipProps } = props

	return (
		<HoverTooltip
			title={<SkillName name={trait.data.name} variant="subtitle1" />}
			sub={
				<Typography variant="caption" color="secondary">
					<T id="skill.trait.tooltip" />
				</Typography>
			}
			extra={trait.data.skills.map((skill, i) => (
				<TraitTooltipSkill key={i} traitSkill={skill} specialization={specialization} />
			))}
			offset={-2}
			{...tooltipProps}
		/>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		resource: getResource(state).skill,
		locale: getLocale(state)
	}
}

export default connect(mapStateToProps)(React.memo(TraitTooltip))
