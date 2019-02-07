import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonBase, Modal, Typography, Divider, Paper, Hidden, Menu, MenuItem } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import { API_SERVER } from '@utils/constants'
import classIcons from '@src/images/classIcons'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import Arena from './Arena'

import { OtherCharacters, CharacterProfile as CharacterProfileType, CharacterBadge } from '@store/Character'

import {
	CharacterProfileContainer,
	ProfileImgContainer,
	ProfileImgModal,
	GeneralInfo,
	NameInfo,
	DetailsContainer,
	ArenaContainer
} from './style'

interface Props {
	profileData: DeepReadonly<CharacterProfileType>
	otherCharacters: DeepReadonly<OtherCharacters>
	badges: DeepReadonlyArray<CharacterBadge>
	className?: string
}

const CharacterProfile: React.FC<Props> = props => {
	const [imgOpen, setImgOpen] = useState(false)
	const [noImage, setNoImage] = useState(false)
	const [accountAnchor, setAccountAnchor] = useState<undefined | HTMLElement>(undefined)

	const { profileData, otherCharacters, badges, className } = props

	const profileImg = (
		<ImageLoader
			src={`${API_SERVER}/proxy/${profileData.region.toLowerCase()}/profile_img/${profileData.profileImg}`}
			onError={() => setNoImage(true)}
		/>
	)

	let accountCharacters: React.ReactElement<HTMLElement>[] = []
	if (otherCharacters.account === profileData.account) {
		accountCharacters = otherCharacters.list.map(character => (
			<Link to={`/character/${profileData.region.toLowerCase()}/${character}`} key={character}>
				<MenuItem>{character}</MenuItem>
			</Link>
		))
	}

	return (
		<CharacterProfileContainer className={className}>
			<ProfileImgContainer noImage={noImage}>
				<ButtonBase onClick={() => setImgOpen(true)} disabled={noImage}>
					{profileImg}
				</ButtonBase>
			</ProfileImgContainer>
			<GeneralInfo noImage={noImage}>
				<NameInfo>
					<Typography variant="h3" color="inherit" noWrap>
						{profileData.name}
					</Typography>
					<Typography color="textSecondary">
						<ButtonBase onClick={event => setAccountAnchor(event.currentTarget)}>
							{profileData.account}
							<ExpandMore />
						</ButtonBase>
					</Typography>
				</NameInfo>
				<Paper component={DetailsContainer}>
					<div>
						<div>
							<ImageLoader src={classIcons[profileData.classCode]} />
							<Typography noWrap inline>
								<T id={['general', 'class_names', profileData.classCode]} />
							</Typography>
						</div>
						<div>
							<Typography inline>
								<T id="character.profile.level" values={{ level: profileData.level[0] }} />
							</Typography>
							{profileData.level[1] && (
								<Typography color="secondary" inline>
									{' '}
									<T id="character.profile.level_hm" values={{ level: profileData.level[1] }} />
								</Typography>
							)}
						</div>
						<div>
							<Typography noWrap inline>
								{profileData.server}{' '}
							</Typography>
							<Typography noWrap inline>
								[{profileData.region}]
							</Typography>
						</div>
						<Typography noWrap>{profileData.faction}</Typography>
						<Typography noWrap>{profileData.clan}</Typography>
						<div>
							{badges.map(badge => (
								<Typography>{badge.name}</Typography>
							))}
						</div>
						<Hidden smUp>
							<Divider />
						</Hidden>
					</div>
					<ArenaContainer>
						<Arena arenaData={profileData.arena} />
					</ArenaContainer>
				</Paper>
			</GeneralInfo>
			<Modal open={imgOpen} onClose={() => setImgOpen(false)}>
				<ButtonBase component={ProfileImgModal} onClick={() => setImgOpen(false)}>
					{profileImg}
				</ButtonBase>
			</Modal>
			<Menu open={!!accountAnchor} anchorEl={accountAnchor} onClose={() => setAccountAnchor(undefined)}>
				{accountCharacters}
			</Menu>
		</CharacterProfileContainer>
	)
}

export default CharacterProfile
