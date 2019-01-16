import * as React from 'react'
import { Paper, Slide } from '@material-ui/core'

import LoadingLyn from '@components/LoadingLyn'

import { Content, Nav } from './style'

interface Props {
	isLoading?: boolean
	className?: string
	topNav?: React.ReactElement<any>
	children: React.ReactNode
}

const PageContainer: React.SFC<Props> = props => {
	const { isLoading, children, topNav, className } = props

	return (
		<>
			<Slide direction="down" in={!!topNav} timeout={500}>
				<Paper component={Nav} square>
					{topNav}
				</Paper>
			</Slide>
			<Content currentKey={isLoading ? 'loading' : 'loaded'} timeout={1000} shift className={className}>
				{isLoading ? <LoadingLyn /> : children}
			</Content>
		</>
	)
}

export default React.memo(PageContainer)
