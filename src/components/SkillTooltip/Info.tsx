import * as React from 'react'
import { Paper, Typography } from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'
import classNames from 'classnames'
import { isEqual } from 'lodash-es'
import T from '@src/components/T'

import { DeepReadonly, DeepReadonlyArray } from '@src/utils/immutableHelper'
import { MoveInfo } from '@src/store/Skills/types'

import style from './styles/index.css'

const getInfoText = (value: number | DeepReadonlyArray<number>, type: 'range' | 'area' | 'time') => {
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

const Info = (currentInfo: DeepReadonly<MoveInfo>, hoverInfo: DeepReadonly<MoveInfo>) => (
	<Typography variant="caption" color="inherit" className={style.info}>
		<div className={style.infoItem}>
			<Paper className={style.infoItemHeader}>
				<T id="tooltip.general.info_header_range" />
			</Paper>
			<Paper className={style.infoItemData}>
				{getInfoText(currentInfo.range, 'range')}
				{currentInfo.range !== hoverInfo.range && (
					<>
						<ArrowDropDown />
						<span className={style.mod}>{getInfoText(hoverInfo.range, 'range')}</span>
					</>
				)}
			</Paper>
		</div>
		<div className={style.infoItem}>
			<Paper className={style.infoItemHeader}>
				<T id="tooltip.general.info_header_area" />
			</Paper>
			{currentInfo.area.type === hoverInfo.area.type ? (
				<Paper className={classNames(style.infoItemData, style[`area_${currentInfo.area.type}`])}>
					{getInfoText(currentInfo.area.range, 'area')}
					{!isEqual(currentInfo.area.range, hoverInfo.area.range) && (
						<>
							<ArrowDropDown />
							<span className={style.mod}>{getInfoText(hoverInfo.area.range, 'area')}</span>
						</>
					)}
				</Paper>
			) : (
				<Paper className={style.infoItemData}>
					<div className={style[`area_${currentInfo.area.type}`]}>
						{getInfoText(currentInfo.area.range, 'area')}
					</div>
					<ArrowDropDown />
					<div className={classNames(style.mod, style[`area_${hoverInfo.area.type}`])}>
						{getInfoText(hoverInfo.area.range, 'area')}
					</div>
				</Paper>
			)}
		</div>
		<div className={style.infoItem}>
			<Paper className={style.infoItemHeader}>
				<T id="tooltip.general.info_header_cast" />
			</Paper>
			<Paper className={style.infoItemData}>
				{getInfoText(currentInfo.cast, 'time')}
				{currentInfo.cast !== hoverInfo.cast && (
					<>
						<ArrowDropDown />
						<span className={style.mod}>{getInfoText(hoverInfo.cast, 'time')}</span>
					</>
				)}
			</Paper>
		</div>
		<div className={style.infoItem}>
			<Paper className={style.infoItemHeader}>
				<T id="tooltip.general.info_header_cooldown" />
			</Paper>
			<Paper className={style.infoItemData}>
				{getInfoText(currentInfo.cooldown, 'time')}
				{currentInfo.cooldown !== hoverInfo.cooldown && (
					<>
						<ArrowDropDown />
						<span className={style.mod}>{getInfoText(hoverInfo.cooldown, 'time')}</span>
					</>
				)}
			</Paper>
		</div>
	</Typography>
)

export default Info
