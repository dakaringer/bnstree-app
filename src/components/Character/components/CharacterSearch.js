import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'

import { viewSelector, recentSearchSelector } from '../../../selectors'
import { setViewOption } from '../../../actions'
import { loadCharacter } from '../actions'
import apollo, { q } from '../../../apollo'

import { Menu, Dropdown, Icon, AutoComplete } from 'antd'

const characterSuggestQuery = q`query ($query: String!, $region: String!) {
    CharacterSuggest(query: $query, region: $region)
}`

const mapStateToProps = state => {
	return {
		region: viewSelector(state).get('characterRegion', 'na'),
		recentSearch: recentSearchSelector(state)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setRegion: region => dispatch(setViewOption('characterRegion', region)),
		loadCharacter: (region, name, history) =>
			dispatch(loadCharacter(region, name, history))
	}
}

class CharacterSearch extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			characterName: '',
			suggestions: [],
			mounted: true
		}
	}

	componentDidMount() {
		let region = this.props.match.params.region
		if (region) {
			this.props.setRegion(region)
		}
	}

	componentWillUnmount() {
		this.setState({
			mounted: false
		})
	}

	enterCharacter(query) {
		const { region } = this.props
		this.setState({ characterName: query })
		apollo
			.query({
				query: characterSuggestQuery,
				variables: {
					query: query,
					region: region
				},
				errorPolicy: 'ignore'
			})
			.then(json => {
				if (this.state.mounted) {
					this.setState({
						suggestions: json.data.CharacterSuggest
					})
				}
			})
	}

	searchCharacter(e) {
		e.preventDefault()
		let { history, region, loadCharacter } = this.props
		loadCharacter(region, this.state.characterName, history)
	}

	selectCharacter(character) {
		let { history, region, loadCharacter } = this.props
		this.setState({
			characterName: character
		})
		loadCharacter(region, character, history)
	}

	render() {
		const {
			t,
			center,
			recent,
			region,
			setRegion,
			recentSearch
		} = this.props

		let recentDiv = null
		if (recent) {
			let recentList = []
			recentSearch.forEach(character => {
				let name = character.get('name')
				let region = character.get('region')
				recentList.push(
					<Link
						to={`/character/${region}/${name}`}
						key={region + name}>
						<div className="recent-item">
							<small className="region">
								{region.toUpperCase()}
							</small>
							{name}
						</div>
					</Link>
				)
			})

			recentDiv = (
				<div key="recent" className="character-search-recent">
					<h4>{t('recentSearch')}</h4>
					<div>{recentList}</div>
				</div>
			)
		}

		let regions = (
			<Menu
				theme="dark"
				onClick={e => setRegion(e.key)}
				selectedKeys={[region]}>
				<Menu.Item key="na">NA</Menu.Item>
				<Menu.Item key="eu">EU</Menu.Item>
				<Menu.Item key="tw">TW</Menu.Item>
				<Menu.Item key="kr">KR</Menu.Item>
			</Menu>
		)

		let suggestions = this.state.suggestions.slice(0)
		if (this.state.characterName !== '') {
			suggestions.unshift(this.state.characterName)
		}

		return [
			<form
				key="form"
				className={`character-search ${center ? 'center' : ''}`}
				onSubmit={e => this.searchCharacter(e)}>
				<Dropdown overlay={regions} trigger={['click']}>
					<a className="regionSelector">
						{region.toUpperCase()} <Icon type="down" />
					</a>
				</Dropdown>
				<div className="inputGroup">
					<AutoComplete
						dataSource={suggestions}
						value={this.state.characterName}
						className="character-input"
						placeholder={
							center ? t('searchCharacter') : t('search')
						}
						onSearch={e => this.enterCharacter(e)}
						onSelect={e => this.selectCharacter(e)}
					/>
					<a onClick={e => this.searchCharacter(e)}>
						<Icon type="search" />
					</a>
				</div>
			</form>,
			recentDiv
		]
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate(['general', 'character'])(CharacterSearch)
)
