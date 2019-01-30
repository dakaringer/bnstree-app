import React from 'react'
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom'

import LoadingLyn from '@components/LoadingLyn'
import FadeContainer from '@components/FadeContainer'

const Home = React.lazy(() => import('@src/pages/Home'))
const Character = React.lazy(() => import('@src/pages/Character'))
const Skills = React.lazy(() => import('@src/pages/Skills'))
const SkillsLegacy = React.lazy(() => import('@src/pages/SkillsLegacy'))
const Items = React.lazy(() => import('@src/pages/Items'))

interface Props extends RouteComponentProps<{}> {}

const Router: React.FC<Props> = props => {
	const { location } = props
	return (
		<FadeContainer currentKey={location.pathname.split('/')[1]} shift>
			<React.Suspense fallback={<LoadingLyn />}>
				<Switch location={location}>
					<Route exact path="/" component={Home} />
					<Route path="/character/:region/:name" component={Character} />
					<Route path="/skills/:className" component={Skills} />
					<Route path="/skills-legacy/:className" component={SkillsLegacy} />
					<Route path="/items/:itemType" component={Items} />
				</Switch>
			</React.Suspense>
		</FadeContainer>
	)
}

export default withRouter(Router)
