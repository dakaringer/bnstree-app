import React, {Component} from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Route, Switch} from 'react-router-dom'

import './styles/Character.scss'

import Header from './components/CharacterHeader'
import CharacterSearch from './components/CharacterSearch'
import CharacterViewer from './components/CharacterViewer'

import {currentLanguageSelector} from '../../selectors'
import {loadTextData} from '../Skills/actions'

const mapStateToProps = state => {
    return {
        currentLanguage: currentLanguageSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadText: lang => dispatch(loadTextData(lang))
    }
}

class Character extends Component {
    componentWillMount() {
        const {currentLanguage, loadText} = this.props
        loadText(currentLanguage)
    }
    componentWillReceiveProps(nextProps) {
        const {currentLanguage, loadText} = this.props

        if (nextProps.currentLanguage !== currentLanguage) {
            loadText(nextProps.currentLanguage)
        }
    }
    componentDidMount() {
        const {t} = this.props
        document.title = `${t('character')} | BnSTree`
    }

    render() {
        return (
            <div className="character">
                <div className="container">
                    <Header />
                    <div className="main-container">
                        <Switch>
                            <Route
                                exact
                                path={'/character/:region'}
                                render={() => <CharacterSearch center />}
                            />
                            <Route
                                exact
                                path={'/character/:region/:character'}
                                component={CharacterViewer}
                            />
                            <Route render={() => <CharacterSearch center />} />
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(Character))
