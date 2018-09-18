import * as React from 'react'
import classNames from 'classnames'
import { Paper, Slide } from '@material-ui/core'
import LoadingLyn from '@src/components/LoadingLyn'
import FadeContainer from '@src/components/FadeContainer'

import * as style from './styles/index.css'

interface Props {
	isLoading?: boolean
	className?: string
	topNav?: React.ReactElement<any>
}

const Container: React.SFC<Props> = props => {
	const { isLoading, children, topNav, className } = props

	return (
		<>
			<Slide direction="down" in={Boolean(topNav)} timeout={500}>
				<Paper square className={style.topNav}>
					{topNav}
				</Paper>
			</Slide>
			<FadeContainer
				currentKey={isLoading ? 'loading' : 'loaded'}
				timeout={1000}
				className={classNames(style.container, className)}>
				{isLoading ? <LoadingLyn /> : <div className={style.pageContent}>{children}</div>}
			</FadeContainer>
		</>
	)
}

export default Container
