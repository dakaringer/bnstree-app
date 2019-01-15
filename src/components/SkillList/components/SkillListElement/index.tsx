import * as React from 'react'
import { Typography, Paper } from '@material-ui/core'
import { STATIC_SERVER } from '@src/utils/constants'

import ImageLoader from '@components/ImageLoader'
import Virtualizer from '@components/Virtualizer'
import T from '@components/T'
import SkillTooltip from '@components/SkillTooltip'
import SkillName from '@src/components/SkillName'

import { SkillSpecialization, ClassCode } from '@store/constants'
import { Skill } from '@store/Skills/types'

import { SkillListElementContainer, SkillIcon, KeyIcon, SkillLabel } from './style'
import keyIcons from './images/keyIcons'
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
			<Paper component={SkillListElementContainer}>
				<SkillIcon>
					<SkillTooltip
						id={skill._id}
						specialization={specialization}
						currentMoveData={skill.data}
						target={<ImageLoader src={`${STATIC_SERVER}/images/skills/${skill.data.icon}`} />}
						offset={-1}
					/>
				</SkillIcon>
				<div>
					<SkillName name={skill.data.name} variant="subtitle1" />
					{keyIcons[keyIcon] && <KeyIcon src={keyIcons[keyIcon]} />}
				</div>
				<SkillLabel>
					<ImageLoader src={typeIcons[types[skill.data.type]]} />
					<Typography variant="caption" inline>
						<T id={['skill', 'type', skill.data.type]} />
					</Typography>
				</SkillLabel>
			</Paper>
		</Virtualizer>
	)
}

export default React.memo(SkillListElement)
