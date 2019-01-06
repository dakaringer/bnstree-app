import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Paper, Typography, ButtonBase } from '@material-ui/core'
import ImageLoader from '@src/components/ImageLoader'
import Virtualizer from '@src/components/Virtualizer'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { SkillElement, ClassCode } from '@src/store/constants'
import { SkillData, MoveData } from '@src/store/SkillsLegacy/types'
import UserActions from '@src/store/User/actions'

import * as style from './styles/index.css'
import { STATIC_SERVER } from '@src/constants'
import keyIcons from './images/keyIcons'
import MoveButton from './MoveButton'
import SkillTooltip from '@src/components/SkillTooltipLegacy'

interface PropsFromDispatch {
	updatePreferences: typeof UserActions.updatePreferences
}

interface Props extends PropsFromDispatch {
	skillData: DeepReadonly<SkillData>
	classCode: ClassCode
	element: SkillElement
	currentMove: number
	showHotkey: boolean
	readonly: boolean
}

interface State {
	hoverMoveData: DeepReadonly<MoveData> | null
}

class SkillListElement extends React.PureComponent<Props, State> {
	state: State = {
		hoverMoveData: null
	}

	selectMove = (skillId: string, moveData: DeepReadonly<MoveData>) => {
		const { updatePreferences, classCode, element, readonly } = this.props
		if (readonly) return

		updatePreferences({
			skillsLegacy: {
				build: {
					[classCode]: {
						[element]: {
							[skillId]: moveData.move
						}
					}
				}
			}
		})
	}

	render = () => {
		const { skillData, currentMove, element, showHotkey, readonly } = this.props
		const { hoverMoveData } = this.state

		const filteredMoves = skillData.moves.filter(move => !move.element || move.element === element)
		const moves = filteredMoves.map((move, i) => {
			return {
				...move,
				move: move.move > 3 ? i - filteredMoves.length / 2 + 4 : i + 1
			}
		})

		const currentMoveData = moves.find(move => move.move === currentMove)
		if (!currentMoveData) return null

		const keyIcon = isNaN(parseInt(skillData.group.hotkey)) ? skillData.group.hotkey : 'N' + skillData.group.hotkey

		return (
			<Virtualizer minHeight="9rem">
				<Paper className={style.skillListElement}>
					<div className={style.iconContainer}>
						<SkillTooltip
							element={element}
							currentMoveData={currentMoveData}
							hoverMoveData={currentMoveData}
							target={
								<ButtonBase className={style.icon}>
									<ImageLoader src={`${STATIC_SERVER}/images/skills/${currentMoveData.icon}`} />
								</ButtonBase>
							}
						/>
					</div>
					<Typography variant="subtitle1" color="inherit" className={style.skill}>
						{currentMoveData.name}
						{showHotkey && <ImageLoader src={keyIcons[keyIcon]} />}
					</Typography>
					<div className={style.moves}>
						{moves.map(moveData => {
							const moveNumber = moveData.move

							if (moveNumber > 3) return
							const hmMoveData = moves.find(hmMove => hmMove.move === moveNumber + 3)
							return (
								<SkillTooltip
									key={moveNumber}
									element={element}
									currentMoveData={currentMoveData}
									hoverMoveData={hoverMoveData || currentMoveData}
									target={
										<MoveButton
											skillId={skillData._id}
											moveData={moveData}
											hmMoveData={hmMoveData}
											active={moveNumber === currentMove && moves.length !== 1}
											hmActive={moveNumber + 3 === currentMove}
											readonly={readonly || moves.length === 1}
											selectMove={this.selectMove}
											hoverMove={hoverMoveData => this.setState({ hoverMoveData })}
										/>
									}
								/>
							)
						})}
					</div>
				</Paper>
			</Virtualizer>
		)
	}
}
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			updatePreferences: UserActions.updatePreferences
		},
		dispatch
	)

export default connect(
	null,
	mapDispatchToProps
)(SkillListElement)
