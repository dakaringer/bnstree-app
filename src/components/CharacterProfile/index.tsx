import * as React from 'react'
import { Link } from 'react-router-dom'
import { ButtonBase, Modal, Typography, Divider, Paper, Hidden, Menu, MenuItem, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import { ExpandMore } from '@material-ui/icons'
import classNames from 'classnames'
import T from '@src/components/T'
import ImageLoader from '@src/components/ImageLoader'

import { DeepReadonly, DeepReadonlyArray } from '@src/utils/immutableHelper'
import { OtherCharacters, CharacterProfile as CharacterProfileType, CharacterBadge } from '@src/store/Character/types'
import { API_SERVER } from '@src/constants'

import * as style from './styles/index.css'
import classIcons from '@src/images/classIcons'
import Arena from './Arena'

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
				className={style.profileImg}
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
			<div className={classNames(style.characterProfile, className)}>
				<div className={style.profileImgContainer}>
					<ButtonBase
						className={classNames(style.profileImgButton, {
							[style.noImage]: noImage
						})}
						onClick={() => this.setState({ imgOpen: true })}
						disabled={noImage}>
						{profileImg}
					</ButtonBase>
				</div>
				<div
					className={classNames(style.generalInfo, {
						[style.noImage]: noImage
					})}>
					<Modal open={imgOpen} onClose={() => this.setState({ imgOpen: false })}>
						<ButtonBase className={style.profileImgModal} onClick={() => this.setState({ imgOpen: false })}>
							{profileImg}
						</ButtonBase>
					</Modal>
					<div className={style.nameInfo}>
						<Typography variant={isWidthDown('xs', width) ? 'h3' : 'h2'} color="inherit" noWrap>
							{profileData.name}
						</Typography>
						<ButtonBase onClick={event => this.setState({ accountAnchor: event.currentTarget })}>
							<Typography variant="subtitle1" color="textSecondary" className={style.accountName}>
								{profileData.account}
								<ExpandMore />
							</Typography>{' '}
						</ButtonBase>
					</div>
					<Paper className={style.paper}>
						<div className={style.details}>
							<Typography className={style.classInfo} noWrap>
								<ImageLoader src={classIcons[profileData.classCode]} />
								<T id={['general', 'class_names', profileData.classCode]} />
							</Typography>
							<div className={style.levelInfo}>
								<Typography className={style.level}>
									<T id="character.profile.level" values={{ level: profileData.level[0] }} />
								</Typography>
								{profileData.level[1] && (
									<Typography className={style.hmLevel} color="secondary">
										<T id="character.profile.level_hm" values={{ level: profileData.level[1] }} />
									</Typography>
								)}
							</div>
							<div className={style.serverInfo}>
								<Typography className={style.server} noWrap>
									{profileData.server}
								</Typography>
								<Typography className={style.region} noWrap>
									[{profileData.region}]
								</Typography>
							</div>
							<Typography noWrap>{profileData.faction}</Typography>
							<Typography noWrap>{profileData.clan}</Typography>
							<div className={style.badges}>
								{badges.map(badge => (
									<Typography className={classNames(style.badge, style[`grade_${badge.grade}`])}>
										{badge.name}
									</Typography>
								))}
							</div>
							<Hidden smUp>
								<Divider />
							</Hidden>
						</div>
						<div className={style.arenaInfo}>
							<Arena arenaData={profileData.arena} />
						</div>
					</Paper>
				</div>
				<Menu
					open={Boolean(accountAnchor)}
					anchorEl={accountAnchor}
					onClose={() => this.setState({ accountAnchor: undefined })}>
					{accountCharacters}
				</Menu>
			</div>
		)
	}
}

export default withWidth()(CharacterProfile)
