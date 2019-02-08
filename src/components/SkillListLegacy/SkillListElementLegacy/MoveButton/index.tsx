import React from 'react'
import { Button, Checkbox } from '@material-ui/core'
import { useRender } from '@utils/hooks'

import ImageLoader from '@components/ImageLoader'
import T from '@components/T'

import { MoveData } from '@store/SkillsLegacy'

import { MoveButtonContainer, StyledMoveButton, HMToggle } from './style'
import { types, typeIcons } from './images/typeIcons'
import masteryIcon from './images/ic_mastery_pc.png'
import masteryIcon_selected from './images/ic_mastery_pc_active.png'

interface Props {
	skillId: string
	moveData: DeepReadonly<MoveData>
	hmMoveData?: DeepReadonly<MoveData>
	active: boolean
	hmActive: boolean
	readonly: boolean
	selectMove: (skillId: string, moveData: DeepReadonly<MoveData>) => void
	hoverMove: (hoverMoveData: DeepReadonly<MoveData>) => void
}

const MoveButton: React.FC<Props> = props => {
	const { skillId, moveData, hmMoveData, active, hmActive, readonly, selectMove, hoverMove } = props

	const type = types[hmMoveData && hmActive ? hmMoveData.type : moveData.type]

	const handleHover = (hoverMoveData: DeepReadonlyObject<MoveData>) => () => hoverMove(hoverMoveData)
	const handleSelect = (condition: boolean, selectMoveData: DeepReadonlyObject<MoveData>) => (
		event: React.MouseEvent<HTMLElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>
	) => {
		event.stopPropagation()
		if (condition) {
			selectMove(skillId, selectMoveData)
		}
	}

	return (
		<MoveButtonContainer onPointerEnter={handleHover(hmActive && hmMoveData ? hmMoveData : moveData)}>
			<Button
				component={useRender(buttonProps => (
					<StyledMoveButton
						withHM={!!hmMoveData}
						disabled={readonly}
						active={active || hmActive}
						{...buttonProps}
					/>
				))}
				variant="outlined"
				onClick={handleSelect(selectMove && !hmActive, moveData)}
				disabled={readonly}>
				<ImageLoader src={typeIcons[type + (active || hmActive ? '_selected' : '')]} />
				<label>
					<T id={['skill', 'type', hmMoveData && hmActive ? hmMoveData.type : moveData.type]} />
				</label>
			</Button>
			{hmMoveData && (
				<HMToggle
					active={active || hmActive}
					onPointerEnter={handleHover(hmMoveData)}
					onPointerLeave={handleHover(hmActive && hmMoveData ? hmMoveData : moveData)}>
					<Checkbox
						color="primary"
						icon={<ImageLoader src={masteryIcon} />}
						checkedIcon={<ImageLoader src={masteryIcon_selected} />}
						checked={hmActive}
						onChange={handleSelect(!!selectMove, !hmActive ? hmMoveData : moveData)}
						disabled={readonly}
					/>
				</HMToggle>
			)}
		</MoveButtonContainer>
	)
}

export default MoveButton
