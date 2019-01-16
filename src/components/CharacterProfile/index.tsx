import * as React from 'react'
import { Link } from 'react-router-dom'
import { ButtonBase, Modal, Typography, Divider, Paper, Hidden, Menu, MenuItem, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import { ExpandMore } from '@material-ui/icons'
import { API_SERVER } from '@src/utils/constants'
import classIcons from '@src/images/classIcons'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import Arena from './components/Arena'

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

interface Props extends WithWidth {
	profileData: DeepReadonly<CharacterProfileType>
	otherCharacters: DeepReadonly<OtherCharacters>
	badges: DeepReadonlyArray<CharacterBadge>
	className?: string
}

interface State {
	imgOpen: boolean
	noImage: boolean
	accountAnchor: HTMLElement | undefined
}

class CharacterProfile extends React.PureComponent<Props, State> {
	state: State = {
		imgOpen: false,
		noImage: false,
		accountAnchor: undefined
	}

	render = () => {
		const { profileData, otherCharacters, badges, width, className } = this.props
		const { imgOpen, noImage, accountAnchor } = this.state

		const profileImg = (
			<ImageLoader
				src={`${API_SERVER}/proxy/${profileData.region.toLowerCase()}/profile_img/${profileData.profileImg}`}
				onError={() => this.setState({ noImage: true })}
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
					<ButtonBase onClick={() => this.setState({ imgOpen: true })} disabled={noImage}>
						{profileImg}
					</ButtonBase>
				</ProfileImgContainer>
				<GeneralInfo noImage={noImage}>
					<NameInfo>
						<Typography variant={isWidthDown('xs', width) ? 'h3' : 'h2'} color="inherit" noWrap>
							{profileData.name}
						</Typography>
						<Typography color="textSecondary">
							<ButtonBase onClick={event => this.setState({ accountAnchor: event.currentTarget })}>
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
				<Modal open={imgOpen} onClose={() => this.setState({ imgOpen: false })}>
					<ButtonBase component={ProfileImgModal} onClick={() => this.setState({ imgOpen: false })}>
						{profileImg}
					</ButtonBase>
				</Modal>
				<Menu
					open={!!accountAnchor}
					anchorEl={accountAnchor}
					onClose={() => this.setState({ accountAnchor: undefined })}>
					{accountCharacters}
				</Menu>
			</CharacterProfileContainer>
		)
	}
}

export default withWidth()(CharacterProfile)
