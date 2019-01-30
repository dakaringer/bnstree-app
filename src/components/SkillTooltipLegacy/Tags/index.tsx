import React from 'react'
import { Typography } from '@material-ui/core'
import { difference } from 'lodash-es'

import { Tag } from './style'

const Tags = (currentTags: DeepReadonlyArray<string>, hoverTags: DeepReadonlyArray<string>) => {
	const diff = difference(currentTags, hoverTags)

	return (
		<Typography variant="caption">
			{hoverTags.map(tag => (
				<Tag key={tag}>{tag}</Tag>
			))}
			{diff.map(tag => (
				<Tag key={tag} disabled>
					{tag}
				</Tag>
			))}
		</Typography>
	)
}

export default Tags
