import * as React from 'react'
import { Paper, Typography, ButtonBase, Fade } from '@material-ui/core'
import * as classNames from 'classnames'
import ImageLoader from '@src/components/ImageLoader'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { CharacterEquipment as CharacterEquipmentType } from '@src/store/Character/types'
import { CharacterRegion } from '@src/store/constants'
import { API_SERVER } from '@src/constants'

import * as style from './styles/index.css'
import SoulshieldDialog from './SoulshieldDialog'

interface Props {
	equipmentData: DeepReadonly<CharacterEquipmentType>
	region: CharacterRegion
	className?: string
}

interface State {
	soulshieldDialogOpen: boolean
}

class CharacterEquipment extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			soulshieldDialogOpen: false
		}
	}

	render() {
		const { equipmentData, region, className } = this.props
		const { soulshieldDialogOpen } = this.state

		return (
			<>
				<Paper className={classNames(style.characterEquipment, className)}>
					<div className={style.weapon}>
						<ImageLoader
							className={style.icon}
							src={
								equipmentData.weapon.icon
									? `${API_SERVER}/proxy/${region.toLowerCase()}/resource_img/${
											equipmentData.weapon.icon
									  }`
									: ''
							}
						/>
						<div>
							<Typography className={style[equipmentData.weapon.grade]}>
								{equipmentData.weapon.name}
							</Typography>
							<div className={style.gems}>
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
							</div>
						</div>
					</div>
					<div className={style.accessories}>
						{equipmentData.accessories.map((accessory, index) => (
							<Fade in key={accessory.type} timeout={500} style={{ transitionDelay: `${index * 50}ms` }}>
								<Typography className={classNames(style.accessory, style[accessory.grade])}>
									<ImageLoader
										src={
											accessory.icon
												? `${API_SERVER}/proxy/${region.toLowerCase()}/resource_img/${
														accessory.icon
												  }`
												: ''
										}
									/>
									{accessory.name}
								</Typography>
							</Fade>
						))}
					</div>
					<div className={style.cosmetics}>
						{equipmentData.cosmetics.map((cosmetic, index) => (
							<Fade
								in
								key={cosmetic.type}
								timeout={500}
								style={{ transitionDelay: `${(index + 11) * 50}ms` }}>
								<Typography className={classNames(style.cosmetic, style[cosmetic.grade])}>
									<ImageLoader
										src={
											cosmetic.icon
												? `${API_SERVER}/proxy/${region.toLowerCase()}/resource_img/${
														cosmetic.icon
												  }`
												: ''
										}
									/>
									{cosmetic.name}
								</Typography>
							</Fade>
						))}
					</div>
					<div className={style.soulshieldContainer}>
						<div className={style.soulshield}>
							{equipmentData.soulshield.pieces.map((piece, index) => (
								<Fade
									in
									key={index}
									timeout={500}
									style={{ transitionDelay: `${(index + 15) * 50}ms` }}>
									<div>
										<ImageLoader
											className={classNames(style.piece, style[`piece${index + 1}`])}
											src={
												piece.icon
													? `${API_SERVER}/proxy/${region.toLowerCase()}/resource_img/${
															piece.icon
													  }`
													: ''
											}
										/>
									</div>
								</Fade>
							))}
						</div>
						<ButtonBase
							className={style.viewButton}
							onClick={() => this.setState({ soulshieldDialogOpen: true })}>
							<Typography variant="caption" color="textSecondary">
								<T id="character.navigation.soulshield_attributes_button" />
							</Typography>
						</ButtonBase>
					</div>
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
