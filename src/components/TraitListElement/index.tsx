import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Paper, Typography, ButtonBase, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import classNames from 'classnames'
import ImageLoader from '@src/components/ImageLoader'
import Virtualizer from '@src/components/Virtualizer'
import compose from '@src/utils/compose'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { RootState } from '@src/store/rootReducer'
import { Trait } from '@src/store/Skills/types'
import UserActions from '@src/store/User/actions'
import { getCurrentClass, getSpecialization, getBuild } from '@src/store/Skills/selectors'

import { STATIC_SERVER } from '@src/constants'
import style from './styles/index.css'
import TraitTooltip from '@src/components/TraitTooltip'

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
			<Paper
				className={classNames(style.traitListElement, { [style.active]: active })}
				onClick={() =>
					updatePreferences({
						skills: {
							builds: {
								[classCode]: {
									[specialization]: build.map((n, i) =>
										i === trait.index[0] - 1 ? trait.index[1] : n
									)
								}
							}
						}
					})
				}>
				<TraitTooltip
					trait={trait}
					specialization={specialization}
					target={
						<ButtonBase className={style.icon}>
							<ImageLoader src={`${STATIC_SERVER}/images/skills/${trait.data.icon}`} />
						</ButtonBase>
					}
				/>
				<Typography
					variant={isWidthDown('xs', width) ? 'caption' : 'subtitle1'}
					color="inherit"
					className={style.skill}>
					{trait.data.name}
				</Typography>
			</Paper>
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
