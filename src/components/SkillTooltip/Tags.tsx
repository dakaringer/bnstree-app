import * as React from 'react'
import { Typography } from '@material-ui/core'
import { difference } from 'lodash-es'
import * as classNames from 'classnames'
import T from '@src/components/T'

import { DeepReadonlyArray } from '@src/utils/immutableHelper'

import * as style from './styles/index.css'

const Tags = (currentTags: DeepReadonlyArray<string>, hoverTags: DeepReadonlyArray<string>) => {
	const diff = difference(currentTags, hoverTags)

	return (
		<span className={style.tags}>
			{hoverTags.map(tag => (
				<Typography key={tag} variant="caption" className={style.tag}>
					<T id={['skill', 'tag', tag]} />
				</Typography>
			))}
			{diff.map(tag => (
				<Typography key={tag} variant="caption" className={classNames(style.tag, style.disabled)}>
					<T id={['skill', 'tag', tag]} />
				</Typography>
			))}
		</span>
	)
}

export default Tags
