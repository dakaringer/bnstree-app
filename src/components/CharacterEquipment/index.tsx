import * as React from 'react'
import { Typography, Button, Fade, Paper } from '@material-ui/core'
import { API_SERVER } from '@src/utils/constants'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import ItemName from '@components/ItemName'
import SoulshieldDialog from './components/SoulshieldDialog'

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

interface State {
	soulshieldDialogOpen: boolean
}

class CharacterEquipment extends React.PureComponent<Props, State> {
	state: State = {
		soulshieldDialogOpen: false
	}

	render = () => {
		const { equipmentData, region, className } = this.props
		const { soulshieldDialogOpen } = this.state

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
						<Typography>
							<ItemName name={equipmentData.weapon.name} grade={equipmentData.weapon.grade} />
						</Typography>
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
								<Typography component={Item}>
									<ItemName
										name={accessory.name}
										grade={accessory.grade}
										icon={accessory.icon || 'none'}
										fromNc={region.toLowerCase()}
									/>
								</Typography>
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
								<Typography component={Item}>
									<ItemName
										name={cosmetic.name}
										grade={cosmetic.grade}
										icon={cosmetic.icon || 'none'}
										fromNc={region.toLowerCase()}
									/>
								</Typography>
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
						<Button onClick={() => this.setState({ soulshieldDialogOpen: true })}>
							<Typography variant="caption" color="textSecondary">
								<T id="character.navigation.soulshield_attributes_button" />
							</Typography>
						</Button>
					</SoulshieldContainer>
				</Paper>
				<SoulshieldDialog
					soulshieldData={equipmentData.soulshield}
					open={soulshieldDialogOpen}
					close={() => this.setState({ soulshieldDialogOpen: false })}
				/>
			</>
		)
	}
}

export default CharacterEquipment
