import React from 'react'
import {translate} from 'react-i18next'
import {withRouter} from 'react-router'

import {Icon} from 'antd'
import {Radio, RadioGroup} from 'react-radio-group'

class CharacterSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            characterName: '',
            region: 'na'
        }
    }
    componentDidMount() {
        this.setState({region: this.props.match.params.region || 'na'})
    }

    changeRegion(value) {
        this.setState({region: value})
    }

    enterCharacter(e) {
        this.setState({characterName: e.target.value})
    }

    searchCharacter(e) {
        e.preventDefault()
        this.props.history.push(`/character/${this.state.region}/${this.state.characterName}`)
    }

    render() {
        const {t, center} = this.props

        return (
            <form
                className={`character-search ${center ? 'center' : ''}`}
                onSubmit={e => this.searchCharacter(e)}>
                <RadioGroup
                    name="fruit"
                    selectedValue={this.state.region}
                    onChange={value => this.changeRegion(value)}
                    className="regionSelector">
                    <label>
                        <Radio value="na" />NA
                    </label>
                    <label>
                        <Radio value="eu" />EU
                    </label>
                </RadioGroup>
                <div className="inputGroup">
                    <input
                        onChange={e => this.enterCharacter(e)}
                        value={this.state.characterName}
                        className="character-input"
                        placeholder={t('search')}
                    />
                    <a onClick={e => this.searchCharacter(e)}>
                        <Icon type="search" />
                    </a>
                </div>
            </form>
        )
    }
}

export default withRouter(translate('general')(CharacterSearch))
