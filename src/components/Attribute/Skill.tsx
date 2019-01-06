import * as React from 'react'
import ImageLoader from '@src/components/ImageLoader'

import { STATIC_SERVER } from '@src/constants'
import { getNameData } from '@src/utils/helpers'
import style from './styles/Skill.css'

interface Props {
	skillName: string
	noIcon?: boolean
}

const Skill: React.SFC<Props> = props => {
	const { skillName, noIcon } = props

	const nameData = getNameData(skillName, 'skill')
	if (!nameData) return null

	return (
		<span>
			<span className={style.skill}>
				{!noIcon && <ImageLoader src={`${STATIC_SERVER}/images/skills/${nameData.icon}`} />}
				{nameData.name}
			</span>
		</span>
	)
}

export default React.memo(Skill)
