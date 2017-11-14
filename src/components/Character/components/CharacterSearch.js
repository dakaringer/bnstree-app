import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'

import {viewSelector, recentSearchSelector} from '../../../selectors'
import {setViewOption} from '../../../actions'
import {loadCharacter} from '../actions'

import {Icon, Radio} from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const mapStateToProps = state => {
    return {
        region: viewSelector(state).get('characterRegion', 'na'),
        recentSearch: recentSearchSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setRegion: region => dispatch(setViewOption('characterRegion', region)),
        loadCharacter: (region, name, history) => dispatch(loadCharacter(region, name, history))
    }
}

class CharacterSearch extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            characterName: ''
        }
    }

    componentWillMount() {
        let region = this.props.match.params.region
        if (region) {
            this.props.setRegion(region)
        }
    }

    enterCharacter(e) {
        this.setState({characterName: e.target.value})
    }

    searchCharacter(e) {
        e.preventDefault()
        let {history, region, loadCharacter} = this.props
        loadCharacter(region, this.state.characterName, history)
    }

    render() {
        const {t, center, recent, region, setRegion, recentSearch} = this.props

        let recentDiv = null
        if (recent) {
            let recentList = []
            recentSearch.forEach(character => {
                let name = character.get('name')
                let region = character.get('region')
                recentList.push(
                    <Link to={`/character/${region}/${name}`} key={region + name}>
                        <div className="recent-item">
                            <small className="region">{region.toUpperCase()}</small>
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

        return [
            <form
                key="form"
                className={`character-search ${center ? 'center' : ''}`}
                onSubmit={e => this.searchCharacter(e)}>
                <RadioGroup
                    className="regionSelector"
                    size="small"
                    value={region}
                    onChange={e => setRegion(e.target.value)}>
                    <RadioButton value="na">NA</RadioButton>
                    <RadioButton value="eu">EU</RadioButton>
                    <RadioButton value="kr">KR</RadioButton>
                </RadioGroup>
                <div className="inputGroup">
                    <input
                        onChange={e => this.enterCharacter(e)}
                        value={this.state.characterName}
                        className="character-input"
                        placeholder={t('searchCharacter')}
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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        translate(['general', 'character'])(CharacterSearch)
    )
)
