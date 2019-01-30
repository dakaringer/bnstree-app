import React from 'react'
import { Typography } from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'
import { get, isEqual } from 'lodash-es'

import T from '@components/T'
import ModText from '@components/ModText'

import { SkillElement } from '@store'
import { MoveInfo } from '@store/SkillsLegacy'
import areaIcons from './images/areaIcons'

import { InfoContainer, InfoItem, InfoItemHeader, InfoItemData, AreaContainer, AreaImage } from './style'

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
		<div>
			<Typography variant="caption" color="inherit">
				<InfoContainer>
					<InfoItem>
						<InfoItemHeader>
							<T id="tooltip.general.info_header_range" />
						</InfoItemHeader>
						<InfoItemData>
							{getInfoText(currentInfo.range, 'range', element)}
							{currentInfo.range !== hoverInfo.range && (
								<>
									<ArrowDropDown />
									<ModText flag="mod">{getInfoText(hoverInfo.range, 'range', element)}</ModText>
								</>
							)}
						</InfoItemData>
					</InfoItem>
					<InfoItem>
						<InfoItemHeader>
							<T id="tooltip.general.info_header_area" />
						</InfoItemHeader>
						{currentArea.type === hoverArea.type ? (
							<InfoItemData>
								<AreaContainer>
									<AreaImage src={areaIcons[`A${hoverArea.type}`]} />
									{getInfoText(currentArea.range, 'area', element)}
									{!isEqual(currentArea.range, hoverArea.range) && (
										<>
											<ArrowDropDown />
											<ModText flag="mod">
												{getInfoText(hoverArea.range, 'area', element)}
											</ModText>
										</>
									)}
								</AreaContainer>
							</InfoItemData>
						) : (
							<InfoItemData>
								<AreaContainer>
									<AreaImage src={areaIcons[`A${currentArea.type}`]} />
									{getInfoText(currentArea.range, 'area', element)}
								</AreaContainer>
								<ArrowDropDown />
								<AreaContainer flag="mod">
									<AreaImage src={areaIcons[`A${hoverArea.type}`]} />
									{getInfoText(hoverArea.range, 'area', element)}
								</AreaContainer>
							</InfoItemData>
						)}
					</InfoItem>
					<InfoItem>
						<InfoItemHeader>
							<T id="tooltip.general.info_header_cast" />
						</InfoItemHeader>
						<InfoItemData>
							{getInfoText(currentInfo.cast, 'time', element)}
							{currentInfo.cast !== hoverInfo.cast && (
								<>
									<ArrowDropDown />
									<ModText flag="mod">{getInfoText(hoverInfo.cast, 'time', element)}</ModText>
								</>
							)}
						</InfoItemData>
					</InfoItem>
					<InfoItem>
						<InfoItemHeader>
							<T id="tooltip.general.info_header_cooldown" />
						</InfoItemHeader>
						<InfoItemData>
							{getInfoText(currentInfo.cooldown, 'time', element)}
							{currentInfo.cooldown !== hoverInfo.cooldown && (
								<>
									<ArrowDropDown />
									<ModText flag="mod">{getInfoText(hoverInfo.cooldown, 'time', element)}</ModText>
								</>
							)}
						</InfoItemData>
					</InfoItem>
				</InfoContainer>
			</Typography>
		</div>
	)
}

export default Info
