import React from 'react'
import { Typography } from '@material-ui/core'
import { TypographyProps } from '@material-ui/core/Typography'
import { difference } from 'lodash-es'
import { useRender } from '@utils/hooks'

import { Tag } from './style'

const Tags = (currentTags: DeepReadonlyArray<string>, hoverTags: DeepReadonlyArray<string>) => {
	const diff = difference(currentTags, hoverTags)

	const renderTag = useRender((disabled?: boolean) => (typographyProps: TypographyProps) => (
		<Tag {...typographyProps} disabled={disabled} />
	))

	return (
		<div>
			{hoverTags.map(tag => (
				<Typography key={tag} variant="caption" component={renderTag()}>
					{tag}
				</Typography>
			))}
			{diff.map(tag => (
				<Typography key={tag} variant="caption" component={renderTag(true)}>
					{tag}
				</Typography>
			))}
		</div>
	)
}

export default Tags
