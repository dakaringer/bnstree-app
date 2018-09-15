import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Typography, Paper } from '@material-ui/core'
import T from '@src/components/T'
import FadeContainer from '@src/components/FadeContainer'

import { RootState } from '@src/store/rootReducer'
import { CharacterRegion, ClassCode, SkillElement } from '@src/store/constants'
import { getData, getIsLoading } from '@src/store/Character/selectors'
import CharacterActions from '@src/store/Character/actions'
import UserActions from '@src/store/User/actions'

import * as style from './styles/index.css'
import PageContainer from '@src/components/PageContainer'
import CharacterProfile from '@src/components/CharacterProfile'
import CharacterEquipment from '@src/components/CharacterEquipment'
import CharacterStats from '@src/components/CharacterStats'
import SkillList from '@src/components/SkillList'

const classElements: {
	[key in ClassCode]: {
		[i: number]: SkillElement
	}
} = {
	BM: {
		0: 'FLAME',
		1: 'LIGHTNING'
	},
	KF: {
		0: 'WIND',
		1: 'FLAME'
	},
	DE: {
		0: 'EARTH',
		1: 'SHADOW'
	},
	FM: {
		0: 'FLAME',
		1: 'FROST'
	},
	AS: {
		0: 'SHADOW',
		1: 'LIGHTNING'
	},
	SU: {
		0: 'WIND',
		1: 'EARTH'
	},
	BD: {
		0: 'WIND',
		1: 'LIGHTNING'
	},
	SF: {
		0: 'EARTH',
		1: 'FROST'
	},
	WL: {
		0: 'FROST',
		1: 'SHADOW'
	},
	GS: {
		0: 'FLAME',
		1: 'SHADOW'
	},
	WR: {
		0: 'LIGHTNING',
		1: 'FROST'
	}
}

interface PropsFromStore {
	characterData: ReturnType<typeof getData>
	isLoading: ReturnType<typeof getIsLoading>
}

interface PropsFromDispatch {
	search: typeof CharacterActions.search
	updatePreferences: typeof UserActions.updatePreferences
}

interface Props extends PropsFromStore, PropsFromDispatch, RouteComponentProps<{ region: string; name: string }> {}

class CharacterPage extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props)
		const { match, search, updatePreferences } = props
		const region = match.params.region.toUpperCase() as CharacterRegion
		const name = match.params.name
		updatePreferences({ character: { region: this.validateRegion(region) as CharacterRegion } })
		search({ name, region })
	}

	componentWillUnmount() {
		const { search } = this.props
		search(null)
	}

	componentDidUpdate(prevProps: Props) {
		const { match, search, updatePreferences } = this.props
		const region = match.params.region.toUpperCase() as CharacterRegion
		const name = match.params.name

		const prevRegion = prevProps.match.params.region.toUpperCase() as CharacterRegion
		const prevName = prevProps.match.params.name

		if (region !== prevRegion || name !== prevName) {
			updatePreferences({ character: { region: this.validateRegion(region) as CharacterRegion } })
			search({ name, region })
		}
	}

	validateRegion = (region: string) => {
		const validRegions = ['NA', 'EU', 'KR', 'TW']
		return validRegions.includes(region) ? region : 'NA'
	}

	render() {
		const { characterData, isLoading } = this.props

		return (
			<PageContainer isLoading={!characterData || isLoading} className={style.character}>
				{!characterData ||
				!characterData.profile ||
				!characterData.equipment ||
				!characterData.stats ||
				!characterData.skills ||
				'failed' in characterData.profile ? (
					<>
						<Typography variant="display3" className={style.notFound}>
							<T id="character.not_found" />
						</Typography>
						{characterData &&
							characterData.profile.failed === 'nameChanged' && (
								<Typography variant="title" className={style.notFound} color="textSecondary">
									<T id="character.not_found_name_changed" />
								</Typography>
							)}
					</>
				) : (
					<FadeContainer currentKey={`${characterData.profile.region}-${characterData.profile.name}`}>
						<CharacterProfile
							profileData={characterData.profile}
							otherCharacters={characterData.otherCharacters}
							badges={characterData.badges}
						/>
						<div className={style.characterInfo}>
							<CharacterStats
								statData={characterData.stats}
								type="attack"
								classCode={characterData.profile.classCode}
								className={style.stats}
							/>
							<CharacterStats
								statData={characterData.stats}
								type="defense"
								classCode={characterData.profile.classCode}
								className={style.stats}
							/>
							<CharacterEquipment
								equipmentData={characterData.equipment}
								region={characterData.profile.region}
								className={style.equipment}
							/>
						</div>
						<Paper className={style.characterSkills}>
							<Typography variant="display1">
								<T id="character.navigation.skills" />
							</Typography>
							<SkillList
								classCode={characterData.profile.classCode}
								element={
									classElements[characterData.profile.classCode][characterData.skills.elementIndex]
								}
								buildData={characterData.skills.build}
								readonly
							/>
						</Paper>
					</FadeContainer>
				)}
			</PageContainer>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		characterData: getData(state),
		isLoading: getIsLoading(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			search: CharacterActions.search,
			updatePreferences: UserActions.updatePreferences
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CharacterPage)
