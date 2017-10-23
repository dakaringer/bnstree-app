import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Route, Switch, Redirect} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {Fade} from 'react-reveal'

import AdSense from '../AdSense/AdSense'

import {currentLanguageSelector, loadingSelector, userSelector} from '../../selectors'
import {viewSelector} from '../../selectors'
import {loadTextData, loadClass, loadBuild} from './actions'

import './styles/Classes.scss'

import {classes} from '../NavBar/NavBar'
import LoadingLyn from '../LoadingLyn/LoadingLyn'
import Header from './components/ClassHeader'
import SkillSubMenu from './components/SkillSubMenu'
import SkillList from './components/SkillList'
import SkillGrid from './components/SkillGrid'
import SkillBuildList from './components/SkillBuildList'
import BadgeList from './components/BadgeList'
import SoulshieldList from './components/SoulshieldList'

function getClassCode(link) {
    let classCode = 'BM'
    classes.forEach(c => {
        if (c[1] === link) {
            classCode = c[0]
        }
    })
    return classCode
}

function getPath(link) {
    let item = link.split('/').slice(-1)[0]
    switch (item) {
        case 'builds':
            return 'userBuilds'
        case 'my-builds':
            return 'myBuilds'
        case 'badges':
            return 'badges'
        case 'soulshields':
            return 'soulshields'
        default:
            return 'skills'
    }
}

const mapStateToProps = state => {
    return {
        currentLanguage: currentLanguageSelector(state),
        view: viewSelector(state),
        loading: loadingSelector(state),
        user: userSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadText: lang => dispatch(loadTextData(lang)),
        loadClass: classCode => dispatch(loadClass(classCode)),
        loadBuild: (buildCode, buildId) => dispatch(loadBuild(buildCode, buildId))
    }
}

class Skills extends React.PureComponent {
    componentWillMount() {
        const {match, currentLanguage, loadText, loadClass} = this.props

        let classCode = getClassCode(match.params.classCode)
        loadText(currentLanguage)
        loadClass(classCode)
    }
    componentWillReceiveProps(nextProps) {
        const {
            location,
            match,
            currentLanguage,
            loading,
            loadText,
            loadClass,
            loadBuild
        } = this.props

        let params = new URLSearchParams(location.search)
        let nextParams = new URLSearchParams(nextProps.location.search)
        let classCode = getClassCode(nextProps.match.params.classCode)
        if (nextProps.currentLanguage !== currentLanguage) {
            loadText(nextProps.currentLanguage)
        }
        if (classCode !== getClassCode(match.params.classCode)) {
            loadClass(classCode)
        }
        if (
            (nextProps.loading !== loading && loading === false) ||
            nextParams.get('b') !== params.get('b') ||
            nextParams.get('id') !== params.get('id')
        ) {
            loadBuild(nextParams.get('b'), nextParams.get('id'))
        }
    }

    render() {
        const {t, loading, view, user, location, match} = this.props

        let skillComponent = null
        let classCode = getClassCode(match.params.classCode)

        if (view.get('skillMode') === 'LIST') {
            skillComponent = (
                <div>
                    <SkillSubMenu />
                    <SkillList />
                </div>
            )
        } else {
            skillComponent = (
                <div>
                    <SkillSubMenu />
                    <SkillGrid />
                </div>
            )
        }

        let content = <LoadingLyn />

        if (!loading) {
            content = (
                <div className="main-container">
                    <Switch>
                        <Route exact path="/classes/:classCode" render={() => skillComponent} />
                        <Route exact path={`/classes/:classCode/info`} render={() => null} />
                        <Route
                            exact
                            path="/classes/:classCode/soulshields"
                            component={SoulshieldList}
                        />
                        <Route exact path="/classes/:classCode/badges" component={BadgeList} />
                        <Route exact path="/classes/:classCode/builds" component={SkillBuildList} />
                        {user ? (
                            <Route
                                exact
                                path="/classes/:classCode/my-builds"
                                render={() => <SkillBuildList user />}
                            />
                        ) : (
                            <Redirect
                                from="/classes/:classCode/my-builds"
                                to="/classes/:classCode"
                            />
                        )}
                        <Route
                            exact
                            path="/classes/:classCode/:buildLink"
                            render={() => skillComponent}
                        />
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
            <Fade className="skills">
                <Helmet>
                    <title>{`${t(getPath(location.pathname))} - ${t(classCode)} | BnSTree`}</title>
                </Helmet>
                <AdSense
                    data-ad-client="ca-pub-2048637692232915"
                    data-ad-slot="6768736382"
                    data-ad-format="auto"
                />
                <div className="container">
                    <Header />
                    {content}
                </div>
            </Fade>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['classes', 'general', 'character'])(Skills)
)
