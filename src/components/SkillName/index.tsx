import React from 'react'
import { Typography } from '@material-ui/core'
import { STATIC_SERVER } from '@utils/constants'

import ImageLoader from '@components/ImageLoader'

import { SkillNameContainer } from './style'

interface Props {
	name: React.ReactNode
	icon?: string
	className?: string
	variant?: GetComponentProps<typeof Typography>['variant']
}

const SkillName: React.FC<Props> = props => {
	const { name, icon, className, variant } = props

	return (
		<SkillNameContainer className={className}>
			{icon && <ImageLoader src={`${STATIC_SERVER}/images/skills/${icon}`} />}
			<Typography variant={variant || 'inherit'} color="inherit" component="span" inline>
				{name}
			</Typography>
		</SkillNameContainer>
	)
}

export default SkillName
