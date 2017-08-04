import React from 'react'
import {translate} from 'react-i18next'
import {withRouter} from 'react-router'

import {Icon, Radio} from 'antd'
const RadioGroup = Radio.Group

class CharacterSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            characterName: ''
        }
    }
    componentDidMount() {
        this.setState({region: this.props.match.params.region || 'na'})
    }

    changeRegion(e) {
        this.setState({region: e.target.value})
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
                <RadioGroup onChange={e => this.changeRegion(e)} value={this.state.region}>
                    <Radio key="a" value={'na'}>
                        NA
                    </Radio>
                    <Radio key="b" value={'eu'}>
                        EU
                    </Radio>
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
