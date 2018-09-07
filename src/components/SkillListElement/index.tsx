import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Paper, Typography, ButtonBase } from '@material-ui/core'
import ImageLoader from '@src/components/ImageLoader'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { RootState } from '@src/store/rootReducer'
import { SkillElement, ClassCode } from '@src/store/constants'
import { SkillData, MoveData } from '@src/store/Skills/types'
import { getLocale } from '@src/store/Intl/selectors'
import { getResource } from '@src/store/Resources/selectors'
import UserActions from '@src/store/User/actions'

import * as style from './styles/index.css'
import { STATIC_SERVER } from '@src/constants'
import keyIcons from './images/keyIcons'
import MoveButton from './MoveButton'
import SkillTooltip from '@src/components/SkillTooltip'

interface PropsFromStore {
	resource: ReturnType<typeof getResource>['skill']
	locale: ReturnType<typeof getLocale>
}

interface PropsFromDispatch {
	updatePreferences: typeof UserActions.updatePreferences
}

interface Props extends PropsFromStore, PropsFromDispatch {
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
	constructor(props: Props) {
		super(props)
		this.state = {
			hoverMoveData: null
		}
	}

	selectMove = (skillId: string, moveData: DeepReadonly<MoveData>) => {
		const { updatePreferences, classCode, element, readonly } = this.props
		if (readonly) return

		updatePreferences({
			skills: {
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

	render() {
		const { skillData, resource, currentMove, element, locale, showHotkey, readonly } = this.props
		const { hoverMoveData } = this.state

		const moves = skillData.moves.filter(move => !move.element || move.element === element).map((move, i) => {
			return {
				...move,
				move: i + 1
			}
		})

		const currentMoveData = moves.find(move => move.move === currentMove)
		if (!currentMoveData) return null

		const nameData =
			resource[currentMoveData.name] || resource[`${currentMoveData.name}-${element.toLocaleLowerCase()}`]
		if (!nameData) {
			console.error(`[BnSTree] Missing skill name data: "${currentMoveData.name}"`)
			return null
		}

		const keyIcon = isNaN(parseInt(skillData.group.hotkey)) ? skillData.group.hotkey : 'N' + skillData.group.hotkey

		return (
			<Paper className={style.skillListElement}>
				<div className={style.iconContainer}>
					<SkillTooltip
						element={element}
						currentMoveData={currentMoveData}
						hoverMoveData={currentMoveData}
						target={
							<ButtonBase className={style.icon}>
								<ImageLoader src={`${STATIC_SERVER}/images/skills/${nameData.icon}`} />
							</ButtonBase>
						}
					/>
				</div>
				<Typography variant="subheading" color="inherit" className={style.skill}>
					{nameData.name[locale]}
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
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		resource: getResource(state).skill,
		locale: getLocale(state)
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
	mapStateToProps,
	mapDispatchToProps
)(SkillListElement)
