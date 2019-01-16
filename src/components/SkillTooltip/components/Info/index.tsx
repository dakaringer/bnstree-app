import * as React from 'react'
import { Typography } from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'
import { isEqual } from 'lodash-es'

import T from '@components/T'
import ModText from '@components/ModText'

import { MoveInfo } from '@store/Skills'

import { InfoContainer, InfoItem, InfoItemHeader, InfoItemData, AreaContainer, AreaImage } from './style'

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
	<div>
		<Typography variant="caption" color="inherit">
			<InfoContainer>
				<InfoItem>
					<InfoItemHeader>
						<T id="tooltip.general.info_header_range" />
					</InfoItemHeader>
					<InfoItemData>
						{getInfoText(currentInfo.range, 'range')}
						{currentInfo.range !== hoverInfo.range && (
							<>
								<ArrowDropDown />
								<ModText flag="mod">{getInfoText(hoverInfo.range, 'range')}</ModText>
							</>
						)}
					</InfoItemData>
				</InfoItem>
				<InfoItem>
					<InfoItemHeader>
						<T id="tooltip.general.info_header_area" />
					</InfoItemHeader>
					{currentInfo.area.type === hoverInfo.area.type ? (
						<InfoItemData>
							<AreaContainer>
								<AreaImage area={hoverInfo.area.type} />
								{getInfoText(currentInfo.area.range, 'area')}
								{!isEqual(currentInfo.area.range, hoverInfo.area.range) && (
									<>
										<ArrowDropDown />
										<ModText flag="mod">{getInfoText(hoverInfo.area.range, 'area')}</ModText>
									</>
								)}
							</AreaContainer>
						</InfoItemData>
					) : (
						<InfoItemData>
							<AreaContainer>
								<AreaImage area={currentInfo.area.type} />
								{getInfoText(currentInfo.area.range, 'area')}
							</AreaContainer>
							<ArrowDropDown />
							<AreaContainer flag="mod">
								<AreaImage area={currentInfo.area.type} />
								{getInfoText(hoverInfo.area.range, 'area')}
							</AreaContainer>
						</InfoItemData>
					)}
				</InfoItem>
				<InfoItem>
					<InfoItemHeader>
						<T id="tooltip.general.info_header_cast" />
					</InfoItemHeader>
					<InfoItemData>
						{getInfoText(currentInfo.cast, 'time')}
						{currentInfo.cast !== hoverInfo.cast && (
							<>
								<ArrowDropDown />
								<ModText flag="mod">{getInfoText(hoverInfo.cast, 'time')}</ModText>
							</>
						)}
					</InfoItemData>
				</InfoItem>
				<InfoItem>
					<InfoItemHeader>
						<T id="tooltip.general.info_header_cooldown" />
					</InfoItemHeader>
					<InfoItemData>
						{getInfoText(currentInfo.cooldown, 'time')}
						{currentInfo.cooldown !== hoverInfo.cooldown && (
							<>
								<ArrowDropDown />
								<ModText flag="mod">{getInfoText(hoverInfo.cooldown, 'time')}</ModText>
							</>
						)}
					</InfoItemData>
				</InfoItem>
			</InfoContainer>
		</Typography>
	</div>
)

export default Info
