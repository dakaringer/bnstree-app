import * as React from 'react'
import { Paper, Typography, ButtonBase } from '@material-ui/core'
import ImageLoader from '@src/components/ImageLoader'
import Virtualizer from '@src/components/Virtualizer'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { SkillSpecialization, ClassCode } from '@src/store/constants'
import { Trait } from '@src/store/Skills/types'

import { STATIC_SERVER } from '@src/constants'
import style from './styles/index.css'
import TraitTooltip from '@src/components/TraitTooltip'

interface Props {
	trait: DeepReadonly<Trait>
	specialization: SkillSpecialization<ClassCode>
}

const TraitListElement: React.SFC<Props> = props => {
	const { trait, specialization } = props

	return (
		<Virtualizer minHeight="7rem">
			<Paper className={style.traitListElement}>
				<TraitTooltip
					trait={trait}
					specialization={specialization}
					target={
						<ButtonBase className={style.icon}>
							<ImageLoader src={`${STATIC_SERVER}/images/skills/${trait.data.icon}`} />
						</ButtonBase>
					}
				/>
				<Typography variant="subtitle1" color="inherit" className={style.skill}>
					{trait.data.name}
				</Typography>
			</Paper>
		</Virtualizer>
	)
}

export default React.memo(TraitListElement)
