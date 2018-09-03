import * as React from 'react'
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom'
import * as Loadable from 'react-loadable'

import LoadingLyn from '@src/components/LoadingLyn'
import FadeContainer from '@src/components/FadeContainer'

const loader = (loader: any) => {
	return Loadable({
		loading: () => <LoadingLyn />,
		loader
	})
}

const Home = loader(() => import('@src/pages/Home'))
const Character = loader(() => import('@src/pages/Character'))
const Skills = loader(() => import('@src/pages/Skills'))
const Items = loader(() => import('@src/pages/Items'))

interface Props extends RouteComponentProps<{}> {}

const Router: React.SFC<Props> = props => {
	const { location } = props
	return (
		<FadeContainer currentKey={location.pathname.split('/')[1]} shift>
			<Switch location={location}>
				<Route exact path="/" component={Home} />
				<Route path="/character/:region/:name" component={Character} />
				<Route path="/skills/:className" component={Skills} />
				<Route path="/items/:itemType" component={Items} />
			</Switch>
		</FadeContainer>
	)
}

export default withRouter(Router)
