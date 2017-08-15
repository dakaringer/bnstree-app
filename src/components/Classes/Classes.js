import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Route, Switch, Redirect} from 'react-router-dom'

import {Row, Col} from 'antd'

import {currentLanguageSelector, loadingSelector, userSelector} from '../../selectors'
import {viewSelector} from './selectors'
import {loadTextData, loadClass} from './actions'

import './styles/Classes.scss'

import {classes} from '../NavBar/NavBar'
import LoadingLyn from '../LoadingLyn/LoadingLyn'
import Header from './components/ClassHeader'
import ClassMenu from './components/ClassMenu'
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
        loadClass: (classCode, buildCode, buildLink) =>
            dispatch(loadClass(classCode, buildCode, buildLink))
    }
}

class Skills extends React.Component {
    componentWillMount() {
        const {t, location, match, currentLanguage, loadText, loadClass} = this.props

        let params = new URLSearchParams(location.search)
        let classCode = getClassCode(match.params.classCode)
        loadText(currentLanguage)
        loadClass(classCode, params.get('b'), params.get('id'))

        document.title = `${t(getPath(location.pathname))} - ${t(classCode)} | BnSTree`
    }
    componentWillReceiveProps(nextProps) {
        const {t, location, match, currentLanguage, loadText, loadClass} = this.props

        let params = new URLSearchParams(location.search)
        let nextParams = new URLSearchParams(nextProps.location.search)
        let classCode = getClassCode(nextProps.match.params.classCode)
        if (nextProps.currentLanguage !== currentLanguage) {
            loadText(nextProps.currentLanguage)
        }
        if (
            classCode !== getClassCode(match.params.classCode) ||
            nextParams.get('id') !== params.get('id')
        ) {
            loadClass(classCode, null, nextParams.get('id'))
        }

        if (nextProps.location.pathname !== location.pathname) {
            document.title = `${t(getPath(nextProps.location.pathname))} - ${t(
                classCode
            )} | BnSTree`
        }
    }

    render() {
        const {loading, view, user} = this.props

        let skillComponent = null

        if (view.get('mode') === 'LIST') {
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
                <div className="container">
                    <Header />
                    <Row className="skills-content">
                        <Col sm={4} className="menu-container">
                            <ClassMenu />
                        </Col>
                        <Col sm={20} className="main-container">
                            <Switch>
                                <Route
                                    exact
                                    path="/classes/:classCode"
                                    render={() => skillComponent}
                                />
                                <Route
                                    exact
                                    path={`/classes/:classCode/info`}
                                    render={() => null}
                                />
                                <Route
                                    exact
                                    path="/classes/:classCode/soulshields"
                                    component={SoulshieldList}
                                />
                                <Route
                                    exact
                                    path="/classes/:classCode/badges"
                                    component={BadgeList}
                                />
                                <Route
                                    exact
                                    path="/classes/:classCode/builds"
                                    component={SkillBuildList}
                                />
                                {user
                                    ? <Route
                                          exact
                                          path="/classes/:classCode/my-builds"
                                          render={() => <SkillBuildList user />}
                                      />
                                    : <Redirect
                                          from="/classes/:classCode/my-builds"
                                          to="/classes/:classCode"
                                      />}
                                <Route
                                    exact
                                    path="/classes/:classCode/:buildLink"
                                    render={() => skillComponent}
                                />
                            </Switch>
                        </Col>
                    </Row>
                </div>
            )
        }

        return (
            <div className="skills">
                {content}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['skills', 'general'])(Skills)
)
