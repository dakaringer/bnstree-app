import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Route, Switch} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {Fade} from 'react-reveal'

import AdSense from '../AdSense/AdSense'

import './styles/Character.scss'

import Header from './components/CharacterHeader'
import CharacterSearch from './components/CharacterSearch'
import CharacterViewer from './components/CharacterViewer'

import {currentLanguageSelector} from '../../selectors'
import {loadTextData} from '../Classes/actions'

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

class Character extends React.PureComponent {
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

    render() {
        const {t} = this.props

        return (
            <Fade className="character">
                <Helmet>
                    <title>{`${t('characterSearch')} | BnSTree`}</title>
                </Helmet>
                <AdSense
                    data-ad-client="ca-pub-2048637692232915"
                    data-ad-slot="6768736382"
                    data-ad-format="auto"
                />
                <div className="container">
                    <Header />
                    <div className="main-container">
                        <Switch>
                            <Route
                                exact
                                path={'/character/:region'}
                                render={() => <CharacterSearch center recent />}
                            />
                            <Route
                                exact
                                path={'/character/:region/:character'}
                                component={CharacterViewer}
                            />
                            <Route render={() => <CharacterSearch center recent />} />
                        </Switch>
                    </div>
                    <div className="slim-container">
                        <AdSense
                            data-ad-client="ca-pub-2048637692232915"
                            data-ad-slot="2719129989"
                            data-ad-format="auto"
                        />
                    </div>
                </div>
            </Fade>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(Character))
