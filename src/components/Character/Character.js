import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Route, Switch} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {Fade} from 'react-reveal'
import {animateScroll} from 'react-scroll'

import AdSense from '../AdSense/AdSense'

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

class Character extends React.PureComponent {
    componentWillMount() {
        const {currentLanguage, loadText} = this.props
        loadText(currentLanguage)
    }

    componentDidMount() {
        animateScroll.scrollToTop()
    }

    componentWillReceiveProps(nextProps) {
        const {currentLanguage, loadText} = this.props

        if (nextProps.currentLanguage !== currentLanguage) {
            loadText(nextProps.currentLanguage)
        }
    }

    render() {
        const {t, location, match} = this.props

        return (
            <Fade className="character">
                <Helmet>
                    <title>{`${t('characterSearch')} | BnSTree`}</title>
                    <meta
                        name="description"
                        content="Blade & Soul character profile search for NA and EU servers."
                    />
                </Helmet>
                <AdSense
                    data-ad-client="ca-pub-2048637692232915"
                    data-ad-slot="6768736382"
                    data-ad-format="auto"
                />
                <div className="container">
                    <Header location={location} match={match} />
                    <div className="main-container">
                        <Switch>
                            <Route
                                exact
                                path={'/character/:region'}
                                render={() => <CharacterSearch center recent match={match} />}
                            />
                            <Route
                                exact
                                path={'/character/:region/:character'}
                                component={CharacterViewer}
                            />
                            <Route render={() => <CharacterSearch center recent match={match} />} />
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
