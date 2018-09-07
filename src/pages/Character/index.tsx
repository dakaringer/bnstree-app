import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import T from '@src/components/T'

import { RootState } from '@src/store/rootReducer'
import { CharacterRegion } from '@src/store/constants'
import { getData, getIsLoading } from '@src/store/Character/selectors'
import CharacterActions from '@src/store/Character/actions'
import UserActions from '@src/store/User/actions'

import * as style from './styles/index.css'
import PageContainer from '@src/components/PageContainer'
import CharacterProfile from '@src/components/CharacterProfile'
import CharacterEquipment from '@src/components/CharacterEquipment'
import CharacterStats from '@src/components/CharacterStats'

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

		if (
			!characterData ||
			!characterData.profile ||
			!characterData.equipment ||
			!characterData.stats ||
			'failed' in characterData.profile
		) {
			return (
				<PageContainer isLoading={isLoading}>
					<Typography variant="display3" className={style.notFound}>
						<T id="character.not_found" />
					</Typography>
					{characterData &&
						characterData.profile.failed === 'nameChanged' && (
							<Typography variant="title" className={style.notFound}>
								<T id="character.not_found_name_changed" />
							</Typography>
						)}
				</PageContainer>
			)
		}

		return (
			<PageContainer isLoading={isLoading} className={style.character}>
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
					/>
					<CharacterStats
						statData={characterData.stats}
						type="defense"
						classCode={characterData.profile.classCode}
					/>
					<CharacterEquipment
						equipmentData={characterData.equipment}
						region={characterData.profile.region}
						className={style.equipment}
					/>
				</div>
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