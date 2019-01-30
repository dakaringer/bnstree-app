import React, { useState } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Paper, Typography, ButtonBase } from '@material-ui/core'
import { useCallback } from '@utils/hooks'
import { STATIC_SERVER } from '@utils/constants'

import ImageLoader from '@components/ImageLoader'
import Virtualizer from '@components/Virtualizer'
import SkillTooltip from '@components/SkillTooltipLegacy'

import { SkillElement, ClassCode } from '@store'
import { SkillData, MoveData } from '@store/SkillsLegacy'
import { actions as userActions } from '@store/User'

import { SkillListElementContainer, SkillIcon, KeyIcon, MoveContainer } from './style'
import keyIcons from './images/keyIcons'
import MoveButton from './MoveButton'

interface PropsFromDispatch {
	updatePreferences: typeof userActions.updatePreferences
}

interface Props extends PropsFromDispatch {
	skillData: DeepReadonly<SkillData>
	classCode: ClassCode
	element: SkillElement
	currentMove: number
	showHotkey: boolean
	readonly: boolean
}

const SkillListElement: React.FC<Props> = props => {
	const [hoverMoveData, setHoverMoveData] = useState<DeepReadonly<MoveData> | null>(null)

	const { classCode, skillData, currentMove, element, showHotkey, readonly, updatePreferences } = props

	const selectMove = useCallback((skillId: string, moveData: DeepReadonly<MoveData>) => {
		if (readonly) {
			return
		}

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
	})

	const filteredMoves = skillData.moves.filter(move => !move.element || move.element === element)
	const moves = filteredMoves.map((move, i) => {
		return {
			...move,
			move: move.move > 3 ? i - filteredMoves.length / 2 + 4 : i + 1
		}
	})

	const currentMoveData = moves.find(move => move.move === currentMove)
	if (!currentMoveData) {
		return null
	}

	const keyIcon = isNaN(parseInt(skillData.group.hotkey, 10)) ? skillData.group.hotkey : 'N' + skillData.group.hotkey

	return (
		<Virtualizer minHeight="9rem">
			<Paper component={SkillListElementContainer}>
				<SkillIcon>
					<SkillTooltip
						element={element}
						currentMoveData={currentMoveData}
						hoverMoveData={currentMoveData}
						target={
							<ButtonBase>
								<ImageLoader src={`${STATIC_SERVER}/images/skills/${currentMoveData.icon}`} />
							</ButtonBase>
						}
					/>
				</SkillIcon>
				<Typography variant="subtitle1" color="inherit" className="skill">
					{currentMoveData.name}
					{showHotkey && <KeyIcon src={keyIcons[keyIcon]} />}
				</Typography>
				<MoveContainer>
					{moves.map(moveData => {
						const moveNumber = moveData.move

						if (moveNumber > 3) {
							return
						}
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
										selectMove={selectMove}
										hoverMove={useCallback(hoverMove => setHoverMoveData(hoverMove))}
									/>
								}
							/>
						)
					})}
				</MoveContainer>
			</Paper>
		</Virtualizer>
	)
}
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			updatePreferences: userActions.updatePreferences
		},
		dispatch
	)

export default connect(
	null,
	mapDispatchToProps
)(SkillListElement)
