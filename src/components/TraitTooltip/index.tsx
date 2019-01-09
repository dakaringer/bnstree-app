import * as React from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import BTTooltip from '@src/components/BTTooltip'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { RootState } from '@src/store/rootReducer'
import { Trait } from '@src/store/Skills/types'
import { getResource } from '@src/store/Resources/selectors'
import { getLocale } from '@src/store/Intl/selectors'

import { SkillSpecialization, ClassCode } from '@src/store/constants'

import style from './styles/index.css'
import TraitSkillElement from './TraitSkillElement'

interface Props {
	trait: DeepReadonly<Trait>
	specialization: SkillSpecialization<ClassCode>
	target: React.ReactElement<any>
}

const TraitTooltip: React.SFC<Props> = props => {
	const { trait, specialization, ...tooltipProps } = props

	return (
		<BTTooltip
			title={
				<Typography variant="subtitle1" className={style.skill}>
					{trait.data.name}
				</Typography>
			}
			className={style.traitTooltip}
			sub={
				<Typography variant="caption" color="secondary">
					<T id="skill.trait.tooltip" />
				</Typography>
			}
			extra={trait.data.skills.map((skill, i) => (
				<TraitSkillElement key={i} traitSkill={skill} specialization={specialization} />
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
