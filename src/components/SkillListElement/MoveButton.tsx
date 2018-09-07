import * as React from 'react'
import { Button, Checkbox } from '@material-ui/core'
import * as classNames from 'classnames'
import ImageLoader from '@src/components/ImageLoader'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { MoveData } from '@src/store/Skills/types'

import * as style from './styles/MoveButton.css'
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

const MoveButton: React.SFC<Props> = props => {
	const { skillId, moveData, hmMoveData, active, hmActive, readonly, selectMove, hoverMove } = props

	const type = types[hmMoveData && hmActive ? hmMoveData.type : moveData.type]

	return (
		<div
			className={classNames(style.buttonWrapper, {
				[style.active]: active || hmActive
			})}
			onPointerEnter={() => hoverMove(hmActive && hmMoveData ? hmMoveData : moveData)}>
			<Button
				classes={{
					root: classNames(style.move, {
						[style.hasHM]: Boolean(hmMoveData)
					}),
					label: style.label,
					disabled: style.disabled
				}}
				variant="outlined"
				onClick={() => (selectMove && !hmActive ? selectMove(skillId, moveData) : null)}
				disabled={readonly}>
				{process.env.NODE_ENV === 'production' ? (
					<>
						<ImageLoader
							src={typeIcons[type + (active || hmActive ? '_selected' : '')]}
							className={style.typeIcon}
						/>
						<div className={style.label}>
							<T id={['skill', 'type', hmMoveData && hmActive ? hmMoveData.type : moveData.type]} />
						</div>
					</>
				) : (
					<div className={style.label}>{moveData.name}</div>
				)}
			</Button>
			{hmMoveData && (
				<div
					className={style.hmToggle}
					onPointerEnter={() => hoverMove(hmMoveData)}
					onPointerLeave={() => hoverMove(hmActive && hmMoveData ? hmMoveData : moveData)}>
					<Checkbox
						color="primary"
						icon={<ImageLoader src={masteryIcon} />}
						checkedIcon={<ImageLoader src={masteryIcon_selected} />}
						checked={hmActive}
						onClick={event => event.stopPropagation()}
						onChange={(_event, checked) =>
							selectMove ? selectMove(skillId, checked ? hmMoveData : moveData) : null
						}
						disabled={readonly}
					/>
				</div>
			)}
		</div>
	)
}

export default MoveButton
