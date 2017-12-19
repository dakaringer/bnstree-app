import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Route, Switch, Redirect} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {Fade} from 'react-reveal'
import {animateScroll} from 'react-scroll'

import AdSense from '../AdSense/AdSense'

import {currentLanguageSelector, loadingSelector, viewSelector, userSelector} from '../../selectors'
import {loadSkills, loadBuild} from './actions'
import {loadNameData, loadPatchList} from '../References/actions'

import './styles/Skills.scss'

import classes from '../NavBar/linkmap_skills'
import LoadingLyn from '../LoadingLyn/LoadingLyn'
import Header from './components/SkillHeader'
import SkillSubMenu from './components/SkillSubMenu'
import SkillList from './components/SkillList'
import SkillGrid from './components/SkillGrid'
import SkillBuildList from './components/SkillBuildList'

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
        loadNames: lang => dispatch(loadNameData(lang)),
        loadSkills: classCode => dispatch(loadSkills(classCode)),
        loadBuild: (buildCode, buildId) => dispatch(loadBuild(buildCode, buildId)),
        loadPatchList: () => dispatch(loadPatchList())
    }
}

class Skills extends React.PureComponent {
    componentWillMount() {
        const {match, currentLanguage, loadNames, loadPatchList, loadSkills} = this.props

        let classCode = getClassCode(match.params.classCode)
        loadNames(currentLanguage)
        loadPatchList()
        loadSkills(classCode)
    }

    componentDidMount() {
        animateScroll.scrollToTop()
    }

    componentWillReceiveProps(nextProps) {
        const {
            location,
            match,
            currentLanguage,
            loading,
            loadNames,
            loadSkills,
            loadBuild
        } = this.props

        let params = new URLSearchParams(location.search)
        let nextParams = new URLSearchParams(nextProps.location.search)
        let classCode = getClassCode(nextProps.match.params.classCode)
        if (nextProps.currentLanguage !== currentLanguage) {
            loadNames(nextProps.currentLanguage)
        }
        if (classCode !== getClassCode(match.params.classCode)) {
            loadSkills(classCode)
        }
        if (
            (nextProps.loading !== loading && nextProps.loading === false) ||
            nextParams.get('b') !== params.get('b') ||
            nextParams.get('id') !== params.get('id')
        ) {
            loadBuild(nextParams.get('b'), nextParams.get('id'))
        }
    }

    render() {
        const {t, loading, view, user, location, match} = this.props

        let classCode = getClassCode(match.params.classCode)

        let content = null
        if (!loading) {
            let skillComponent = null
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

            content = (
                <div className="main-container">
                    <Switch>
                        <Route exact path="/skills/:classCode" render={() => skillComponent} />
                        <Route exact path={`/skills/:classCode/info`} render={() => null} />
                        <Route
                            exact
                            path="/skills/:classCode/builds"
                            render={() => <SkillBuildList match={match} />}
                        />
                        {user ? (
                            <Route
                                exact
                                path="/skills/:classCode/my-builds"
                                render={() => <SkillBuildList user match={match} />}
                            />
                        ) : (
                            <Redirect from="/skills/:classCode/my-builds" to="/skills/:classCode" />
                        )}
                        <Route
                            exact
                            path="/skills/:classCode/:buildLink"
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
        } else {
            content = <LoadingLyn />
        }

        return (
            <Fade className="skills">
                <Helmet>
                    <title>{`${t(getPath(location.pathname))} - ${t(classCode)} | BnSTree`}</title>
                    <meta name="description" content="Skill information and builds" />
                </Helmet>
                <AdSense
                    data-ad-client="ca-pub-2048637692232915"
                    data-ad-slot="6768736382"
                    data-ad-format="auto"
                />
                <div className="container">
                    <Header location={location} match={match} />
                    {content}
                </div>
            </Fade>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['classes', 'general', 'character'])(Skills)
)
