import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Route, Switch} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {Fade} from 'react-reveal'
import {animateScroll} from 'react-scroll'

import AdSense from '../AdSense/AdSense'

import {currentLanguageSelector, loadingSelector} from '../../selectors'
import {loadItems} from './actions'
import {loadNameData} from '../References/actions'

import './styles/Items.scss'

import LoadingLyn from '../LoadingLyn/LoadingLyn'
import Header from './components/ItemHeader'
//import BadgeList from './components/BadgeList'
//import SoulshieldList from './components/SoulshieldList'
import ItemTabs from './components/ItemTabs'

function getPath(link) {
    return link.split('/').slice(-1)[0]
}

const mapStateToProps = state => {
    return {
        currentLanguage: currentLanguageSelector(state),
        loading: loadingSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadItems: type => dispatch(loadItems(type)),
        loadNames: lang => dispatch(loadNameData(lang))
    }
}

class Items extends React.PureComponent {
    componentWillMount() {
        const {match, currentLanguage, loadItems, loadNames} = this.props

        loadItems(match.params.type)
        loadNames(currentLanguage)
    }

    componentDidMount() {
        animateScroll.scrollToTop()
    }

    componentWillReceiveProps(nextProps) {
        const {match, currentLanguage, loadItems, loadNames} = this.props

        if (nextProps.match.params.type !== match.params.type) {
            loadItems(nextProps.match.params.type)
        }
        if (nextProps.currentLanguage !== currentLanguage) {
            loadNames(nextProps.currentLanguage)
        }
    }

    render() {
        const {t, loading, location, match} = this.props

        let content = <LoadingLyn />

        if (!loading) {
            content = (
                <div className="main-container">
                    <Switch>
                        <Route exact path="/items/:type" component={ItemTabs} />
                    </Switch>
                    <AdSense
                        data-ad-client="ca-pub-2048637692232915"
                        data-ad-slot="2719129989"
                        data-ad-format="auto"
                    />
                </div>
            )
        }

        return (
            <Fade className="items">
                <Helmet>
                    <title>{`${t(getPath(location.pathname))} | BnSTree`}</title>
                </Helmet>
                <AdSense
                    data-ad-client="ca-pub-2048637692232915"
                    data-ad-slot="6768736382"
                    data-ad-format="auto"
                />
                <div className="container">
                    <Header match={match} />
                    {content}
                </div>
            </Fade>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['items', 'general', 'character', 'classes', 'tooltip'])(Items)
)
