import React, { useState, useEffect } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Paper, MenuItem } from '@material-ui/core'
import Autosuggest from 'react-autosuggest'
import gql from 'graphql-tag'
import { get } from 'lodash-es'
import { useRender, useDebounce } from '@utils/hooks'
import apollo from '@utils/apollo'
import compose from '@utils/compose'
import { getValidRegion } from '@utils/helpers'

import { RootState, CharacterRegion } from '@store'
import { selectors as characterSelectors } from '@store/Character'
import { actions as userActions } from '@store/User'

import { CharacterSearchContainer, SuggestionMenuItem } from './style'
import SearchInput from './SearchInput'

interface PropsFromStore {
	region: ReturnType<typeof characterSelectors.getCharacterPreferences>['region']
}

interface PropsFromDispatch {
	updatePreferences: typeof userActions.updatePreferences
}

interface SelfProps {
	className?: string
	onSubmit: () => void
}

interface Props extends SelfProps, PropsFromStore, PropsFromDispatch, RouteComponentProps<{}> {}

const CharacterSearch: React.FC<Props> = props => {
	const [name, setName] = useState('')
	const [suggestions, setSuggestions] = useState([])
	const [searchString, setSearchString] = useState('')
	const debouncedSearchString = useDebounce(searchString, 200)

	useEffect(() => {
		const { region } = props

		if (debouncedSearchString !== '') {
			apollo
				.query({
					query: gql`
						query searchSuggestions($name: String!, $region: CharacterRegion!) {
							character {
								search(name: $name, region: $region) {
									suggestions
								}
							}
						}
					`,
					variables: {
						name: debouncedSearchString,
						region
					},
					errorPolicy: 'ignore'
				})
				.then(response => {
					setSuggestions(get(response, 'data.character.search.suggestions', []))
				})
		}
	}, [debouncedSearchString])

	const selectRegion = (region: string) => {
		const { updatePreferences } = props
		updatePreferences({ character: { region: (region as CharacterRegion) || 'NA' } })
	}

	const submit = (search: string) => {
		const { region, history, onSubmit } = props
		onSubmit()
		if (search.trim() !== '') {
			const searchRegion = getValidRegion(region)
			history.push(`/character/${searchRegion.toLowerCase()}/${search}`)
			setName('')
		}
	}

	const { className } = props

	return (
		<CharacterSearchContainer className={className}>
			<Autosuggest
				suggestions={suggestions}
				onSuggestionsFetchRequested={options => setSearchString(options.value)}
				onSuggestionsClearRequested={() => setSuggestions([])}
				getSuggestionValue={suggestion => suggestion}
				inputProps={{
					value: name,
					onChange: event => setName(event.currentTarget.value)
				}}
				onSuggestionSelected={(_event, { suggestion }) => submit(suggestion)}
				renderInputComponent={useRender((inputProps: any) => {
					const { region } = props
					const { ref, ...other } = inputProps
					return (
						<SearchInput
							ref={ref}
							inputProps={other}
							currentRegion={region}
							onRegionChange={selectRegion}
							onSubmit={submit}
						/>
					)
				})}
				renderSuggestionsContainer={useRender((options: any) => {
					const { containerProps, children } = options
					return (
						<Paper square {...containerProps}>
							{children}
						</Paper>
					)
				})}
				renderSuggestion={useRender((suggestion: string, options: any) => {
					const { isHighlighted } = options
					return (
						<MenuItem selected={isHighlighted} component={SuggestionMenuItem}>
							{suggestion}
						</MenuItem>
					)
				})}
				theme={{
					container: 'autosuggest-container',
					suggestionsContainer: 'suggestions-container',
					suggestionsList: 'suggestions-list'
				}}
			/>
		</CharacterSearchContainer>
	)
}

const mapStateToProps = (state: RootState) => ({
	region: characterSelectors.getCharacterPreferences(state).region || 'NA'
})

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			updatePreferences: userActions.updatePreferences
		},
		dispatch
	)

export default compose<Props, SelfProps>(
	withRouter,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(CharacterSearch)
