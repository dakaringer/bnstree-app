import React, { useEffect } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import { getValidRegion } from '@utils/helpers'

import T from '@components/T'
import FadeContainer from '@components/FadeContainer'
import PageContainer from '@components/PageContainer'
import CharacterProfile from '@components/CharacterProfile'
import CharacterEquipment from '@components/CharacterEquipment'
import CharacterStats from '@components/CharacterStats'

import { RootState, CharacterRegion } from '@store'
import { selectors as characterSelectors, actions as characterActions } from '@store/Character'
import { actions as userActions } from '@store/User'

import { CharacterLayout } from './style'

interface PropsFromStore {
	characterData: ReturnType<typeof characterSelectors.getData>
	isLoading: ReturnType<typeof characterSelectors.getIsLoading>
}

interface PropsFromDispatch {
	search: typeof characterActions.search
	updatePreferences: typeof userActions.updatePreferences
}

interface Props extends PropsFromStore, PropsFromDispatch, RouteComponentProps<{ region: string; name: string }> {}

const CharacterPage: React.FC<Props> = props => {
	useEffect(() => {
		const { match, search, updatePreferences } = props
		const region = match.params.region.toUpperCase() as CharacterRegion
		const name = match.params.name
		if (region && name) {
			updatePreferences({ character: { region: getValidRegion(region) as CharacterRegion } })
			search({ name, region })
		}

		return () => {
			search(null)
		}
	}, [])

	useEffect(() => {
		const { match, search, updatePreferences } = props
		const region = match.params.region.toUpperCase() as CharacterRegion
		const name = match.params.name

		updatePreferences({ character: { region: getValidRegion(region) as CharacterRegion } })
		search({ name, region })
	}, [props.match.params.name, props.match.params.region])

	const { characterData, isLoading } = props

	return (
		<PageContainer isLoading={!characterData || isLoading}>
			{!characterData ||
			!characterData.profile ||
			!characterData.equipment ||
			!characterData.stats ||
			'failed' in characterData.profile ? (
				<>
					<Typography variant="h2">
						<T id="character.not_found" />
					</Typography>
					{characterData && characterData.profile.failed === 'nameChanged' && (
						<Typography variant="h6" color="textSecondary">
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
					<CharacterLayout>
						<CharacterEquipment
							equipmentData={characterData.equipment}
							region={characterData.profile.region}
							className="equipment"
						/>
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
					</CharacterLayout>
				</FadeContainer>
			)}
		</PageContainer>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		characterData: characterSelectors.getData(state),
		isLoading: characterSelectors.getIsLoading(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			search: characterActions.search,
			updatePreferences: userActions.updatePreferences
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CharacterPage)
