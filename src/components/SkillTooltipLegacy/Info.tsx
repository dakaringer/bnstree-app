import * as React from 'react'
import { Paper, Typography } from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'
import classNames from 'classnames'
import { get, isEqual } from 'lodash-es'
import T from '@components/T'

import { SkillElement } from '@store'
import { MoveInfo } from '@store/SkillsLegacy'

import style from './styles/index.css'

const getInfoText = (
	value: number | DeepReadonlyArray<number> | DeepReadonlyObject<{ [e in SkillElement]?: number | number[] }>,
	type: 'range' | 'area' | 'time',
	element: SkillElement
) => {
	if (typeof value === 'object' && !Array.isArray(value)) {
		value = (value as DeepReadonlyObject<{ [e in SkillElement]: number | number[] }>)[element]
	}

	if (type === 'range' || type === 'area') {
		return value === 0 ? (
			<T id={type === 'range' ? 'tooltip.general.info_from_user' : 'tooltip.general.info_target'} />
		) : (
			<T
				id="tooltip.general.info_distance"
				values={{ value: typeof value === 'number' ? value : value.join(type === 'range' ? ' ~ ' : ' × ') }}
			/>
		)
	} else if (typeof value === 'number') {
		return value === 0 ? (
			<T id="tooltip.general.info_instant" />
		) : (
			<span>
				{value >= 60 && (
					<>
						<T id="tooltip.general.info_time_min" values={{ value: Math.floor(value / 60) }} />{' '}
					</>
				)}
				{value % 60 > 0 && <T id="tooltip.general.info_time_sec" values={{ value: value % 60 }} />}
			</span>
		)
	}
}

const Info = (currentInfo: DeepReadonly<MoveInfo>, hoverInfo: DeepReadonly<MoveInfo>, element: SkillElement) => {
	const currentArea = get(currentInfo.area, element, currentInfo.area) as DeepReadonlyObject<{
		type: number
		range: number | number[]
	}>
	const hoverArea = get(hoverInfo.area, element, hoverInfo.area) as DeepReadonlyObject<{
		type: number
		range: number | number[]
	}>

	return (
		<Typography variant="caption" color="inherit" className={style.info}>
			<div className={style.infoItem}>
				<Paper className={style.infoItemHeader}>
					<T id="tooltip.general.info_header_range" />
				</Paper>
				<Paper className={style.infoItemData}>
					{getInfoText(currentInfo.range, 'range', element)}
					{!isEqual(currentInfo.range, hoverInfo.range) && (
						<>
							<ArrowDropDown />
							<span className={style.mod}>{getInfoText(hoverInfo.range, 'range', element)}</span>
						</>
					)}
				</Paper>
			</div>
			<div className={style.infoItem}>
				<Paper className={style.infoItemHeader}>
					<T id="tooltip.general.info_header_area" />
				</Paper>
				{currentArea.type === hoverArea.type ? (
					<Paper className={classNames(style.infoItemData, style[`area_${currentArea.type}`])}>
						{getInfoText(currentArea.range, 'area', element)}
						{!isEqual(currentArea.range, hoverArea.range) && (
							<>
								<ArrowDropDown />
								<span className={style.mod}>{getInfoText(hoverArea.range, 'area', element)}</span>
							</>
						)}
					</Paper>
				) : (
					<Paper className={style.infoItemData}>
						<div className={style[`area_${currentArea.type}`]}>
							{getInfoText(currentArea.range, 'area', element)}
						</div>
						<ArrowDropDown />
						<div className={classNames(style.mod, style[`area_${hoverArea.type}`])}>
							{getInfoText(hoverArea.range, 'area', element)}
						</div>
					</Paper>
				)}
			</div>
			<div className={style.infoItem}>
				<Paper className={style.infoItemHeader}>
					<T id="tooltip.general.info_header_cast" />
				</Paper>
				<Paper className={style.infoItemData}>
					{getInfoText(currentInfo.cast, 'time', element)}
					{currentInfo.cast !== hoverInfo.cast && (
						<>
							<ArrowDropDown />
							<span className={style.mod}>{getInfoText(hoverInfo.cast, 'time', element)}</span>
						</>
					)}
				</Paper>
			</div>
			<div className={style.infoItem}>
				<Paper className={style.infoItemHeader}>
					<T id="tooltip.general.info_header_cooldown" />
				</Paper>
				<Paper className={style.infoItemData}>
					{getInfoText(currentInfo.cooldown, 'time', element)}
					{currentInfo.cooldown !== hoverInfo.cooldown && (
						<>
							<ArrowDropDown />
							<span className={style.mod}>{getInfoText(hoverInfo.cooldown, 'time', element)}</span>
						</>
					)}
				</Paper>
			</div>
		</Typography>
	)
}

export default Info
