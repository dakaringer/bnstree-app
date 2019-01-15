import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import compose from '@src/utils/compose'
import { STATIC_SERVER } from '@src/utils/constants'

import ImageLoader from '@components/ImageLoader'
import Virtualizer from '@components/Virtualizer'
import SkillName from '@components/SkillName'
import TraitTooltip from '@components/TraitTooltip'

import { RootState } from '@store/rootReducer'
import { Trait } from '@store/Skills/types'
import UserActions from '@store/User/actions'
import { getCurrentClass, getSpecialization, getBuild } from '@store/Skills/selectors'

import { TrailListElementContainer } from './style'

interface PropsFromStore {
	classCode: ReturnType<typeof getCurrentClass>
	specialization: ReturnType<typeof getSpecialization>
	build: ReturnType<typeof getBuild>
}

interface PropsFromDispatch {
	updatePreferences: typeof UserActions.updatePreferences
}

interface SelfProps {
	trait: DeepReadonly<Trait>
}

interface Props extends SelfProps, PropsFromStore, PropsFromDispatch, WithWidth {}

const TraitListElement: React.SFC<Props> = props => {
	const { trait, classCode, specialization, build, width, updatePreferences } = props

	const currentIndex = build[trait.index[0] - 1] || 1
	const active = currentIndex === trait.index[1]

	return (
		<Virtualizer minHeight="7rem">
			<TrailListElementContainer
				active={active}
				onClick={() =>
					updatePreferences({
						skills: {
							builds: {
								[classCode]: {
									[specialization]: new Array(5)
										.fill(1)
										.map((_n, i) => (i === trait.index[0] - 1 ? trait.index[1] : build[i] || 1))
								}
							}
						}
					})
				}>
				<TraitTooltip
					trait={trait}
					specialization={specialization}
					target={<ImageLoader src={`${STATIC_SERVER}/images/skills/${trait.data.icon}`} />}
				/>
				<SkillName name={trait.data.name} variant={isWidthDown('xs', width) ? 'caption' : 'subtitle1'} />
			</TrailListElementContainer>
		</Virtualizer>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		classCode: getCurrentClass(state),
		specialization: getSpecialization(state),
		build: getBuild(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			updatePreferences: UserActions.updatePreferences
		},
		dispatch
	)

export default compose<Props, SelfProps>(
	withWidth(),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(React.memo(TraitListElement))
