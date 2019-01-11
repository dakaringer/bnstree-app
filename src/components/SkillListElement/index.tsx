import * as React from 'react'
import { Paper, Typography, ButtonBase } from '@material-ui/core'
import ImageLoader from '@src/components/ImageLoader'
import Virtualizer from '@src/components/Virtualizer'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { SkillSpecialization, ClassCode } from '@src/store/constants'
import { Skill } from '@src/store/Skills/types'

import { STATIC_SERVER } from '@src/utils/constants'
import style from './styles/index.css'
import keyIcons from './images/keyIcons'
import SkillTooltip from '@src/components/SkillTooltip'
import { types, typeIcons } from './images/typeIcons'

interface Props {
	skill: DeepReadonly<Skill>
	specialization: SkillSpecialization<ClassCode>
}

const SkillListElement: React.SFC<Props> = props => {
	const { skill, specialization } = props

	const keyIcon = isNaN(parseInt(skill.data.hotkey, 10)) ? skill.data.hotkey : 'N' + skill.data.hotkey

	return (
		<Virtualizer minHeight="7rem">
			<Paper className={style.skillListElement}>
				<div className={style.iconContainer}>
					<SkillTooltip
						id={skill._id}
						specialization={specialization}
						currentMoveData={skill.data}
						target={
							<ButtonBase className={style.icon}>
								<ImageLoader src={`${STATIC_SERVER}/images/skills/${skill.data.icon}`} />
							</ButtonBase>
						}
						offset={-1}
					/>
				</div>
				<Typography variant="subtitle1" color="inherit" className={style.skill}>
					{skill.data.name}
					{keyIcons[keyIcon] && <ImageLoader src={keyIcons[keyIcon]} />}
				</Typography>
				<div className={style.label}>
					<ImageLoader src={typeIcons[types[skill.data.type]]} className={style.typeIcon} />
					<T id={['skill', 'type', skill.data.type]} />
				</div>
			</Paper>
		</Virtualizer>
	)
}

export default React.memo(SkillListElement)
