import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {withRouter} from 'react-router'

import {viewSelector} from '../../../selectors'
import {setViewOption} from '../../../actions'

import {Icon, Radio} from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const mapStateToProps = state => {
    return {
        region: viewSelector(state).get('characterRegion', 'na')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setRegion: region => dispatch(setViewOption('characterRegion', region))
    }
}

class CharacterSearch extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            characterName: ''
        }
    }

    enterCharacter(e) {
        this.setState({characterName: e.target.value})
    }

    searchCharacter(e) {
        e.preventDefault()
        this.props.history.push(`/character/${this.props.region}/${this.state.characterName}`)
    }

    render() {
        const {t, center, region, setRegion} = this.props

        return (
            <form
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
            </form>
        )
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(translate('general')(CharacterSearch))
)
