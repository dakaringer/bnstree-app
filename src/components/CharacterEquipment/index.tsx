import React, { useState } from 'react'
import { Typography, Button, Fade, Paper } from '@material-ui/core'
import { API_SERVER } from '@utils/constants'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import ItemName from '@components/ItemName'
import SoulshieldDialog from './SoulshieldDialog'

import { CharacterRegion } from '@store'
import { CharacterEquipment as CharacterEquipmentType } from '@store/Character'

import {
	CharacterEquipmentContainer,
	Weapon,
	Gems,
	Item,
	SoulshieldContainer,
	SoulshieldCircle,
	SoulshieldPiece
} from './style'

interface Props {
	equipmentData: DeepReadonly<CharacterEquipmentType>
	region: CharacterRegion
	className?: string
}

const CharacterEquipment: React.FC<Props> = props => {
	const [soulshieldDialogOpen, setSoulshieldDialogOpen] = useState(false)

	const { equipmentData, region, className } = props

	return (
		<>
			<Paper className={className} component={CharacterEquipmentContainer}>
				<Weapon>
					<ImageLoader
						src={
							equipmentData.weapon.icon
								? `${API_SERVER}/proxy/${region.toLowerCase()}/resource_img/${
										equipmentData.weapon.icon
								  }`
								: ''
						}
					/>
					<ItemName name={equipmentData.weapon.name} grade={equipmentData.weapon.grade} variant="body1" />
					<Gems>
						{equipmentData.weapon.gems.map(gem => (
							<ImageLoader
								src={
									gem.icon
										? `${API_SERVER}/proxy/${region.toLowerCase()}/resource_img/${gem.icon}`
										: ''
								}
								key={gem.icon}
							/>
						))}
					</Gems>
				</Weapon>
				<div className="accessories">
					{equipmentData.accessories.map((accessory, i) => (
						<Fade in key={accessory.type} timeout={500} style={{ transitionDelay: `${i * 50}ms` }}>
							<Item>
								<ItemName
									name={accessory.name}
									grade={accessory.grade}
									icon={accessory.icon || 'none'}
									fromNc={region.toLowerCase()}
									variant="body1"
								/>
							</Item>
						</Fade>
					))}
				</div>
				<div>
					{equipmentData.cosmetics.map((cosmetic, index) => (
						<Fade
							in
							key={cosmetic.type}
							timeout={500}
							style={{ transitionDelay: `${(index + 11) * 50}ms` }}>
							<Item>
								<ItemName
									name={cosmetic.name}
									grade={cosmetic.grade}
									icon={cosmetic.icon || 'none'}
									fromNc={region.toLowerCase()}
									variant="body1"
								/>
							</Item>
						</Fade>
					))}
				</div>
				<SoulshieldContainer>
					<SoulshieldCircle>
						{equipmentData.soulshield.pieces.map((piece, i) => (
							<Fade in key={i} timeout={500} style={{ transitionDelay: `${(i + 15) * 50}ms` }}>
								<SoulshieldPiece n={i + 1}>
									<ImageLoader
										src={
											piece.icon
												? `${API_SERVER}/proxy/${region.toLowerCase()}/resource_img/${
														piece.icon
												  }`
												: ''
										}
									/>
								</SoulshieldPiece>
							</Fade>
						))}
					</SoulshieldCircle>
					{equipmentData.soulshield.pieces.filter(piece => piece.name).length > 0 && (
						<Button onClick={() => setSoulshieldDialogOpen(true)}>
							<Typography variant="caption" color="textSecondary">
								<T id="character.navigation.soulshield_attributes_button" />
							</Typography>
						</Button>
					)}
				</SoulshieldContainer>
			</Paper>
			<SoulshieldDialog
				soulshieldData={equipmentData.soulshield}
				open={soulshieldDialogOpen}
				close={() => setSoulshieldDialogOpen(false)}
			/>
		</>
	)
}

export default CharacterEquipment
