import * as React from 'react'
import * as classNames from 'classnames'
import { Paper, Slide } from '@material-ui/core'
import LoadingLyn from '@src/components/LoadingLyn'

import * as style from './styles/index.css'

interface Props {
	isLoading?: boolean
	className?: string
	topNav?: React.ReactElement<any>
}

const Container: React.SFC<Props> = props => {
	const { isLoading, children, topNav, className } = props

	if (isLoading) {
		return <LoadingLyn />
	}

	return (
		<div className={classNames(style.container, className)}>
			<Slide direction="down" in={Boolean(topNav)} unmountOnExit timeout={500}>
				<Paper square className={style.topNav}>
					{topNav}
				</Paper>
			</Slide>
			<div className={style.pageContent}>{children}</div>
		</div>
	)
}

export default Container
