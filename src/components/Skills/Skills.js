import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Route, Switch, Redirect} from 'react-router-dom'

import {Row, Col} from 'antd'

import {currentLanguageSelector, loadingSelector, userSelector} from '../../selectors'
import {viewSelector} from './selectors'
import {loadTextData, loadClass} from './actions'

import './styles/Skills.scss'

import {classes} from '../NavBar/NavBar'
import LoadingLyn from '../LoadingLyn/LoadingLyn'
import Header from './components/SkillHeader'
import SkillMenu from './components/SkillMenu'
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
        const {location, match, currentLanguage, loadText, loadClass} = this.props

        let params = new URLSearchParams(location.search)
        let classCode = getClassCode(match.params.classCode)
        loadText(currentLanguage)
        loadClass(classCode, params.get('b'), params.get('id'))
    }
    componentWillReceiveProps(nextProps) {
        const {location, match, currentLanguage, loadText, loadClass} = this.props

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
                            <SkillMenu />
                        </Col>
                        <Col sm={20} className="main-container">
                            <Switch>
                                <Route
                                    exact
                                    path="/skills/:classCode"
                                    render={() => skillComponent}
                                />
                                <Route exact path={`/skills/:classCode/info`} render={() => null} />
                                <Route
                                    exact
                                    path="/skills/:classCode/builds"
                                    component={SkillBuildList}
                                />
                                {user
                                    ? <Route
                                          exact
                                          path="/skills/:classCode/myBuilds"
                                          component={SkillBuildList}
                                      />
                                    : <Redirect
                                          from="/skills/:classCode/myBuilds"
                                          to="/skills/:classCode"
                                      />}
                                <Route
                                    exact
                                    path="/skills/:classCode/:buildLink"
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

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(Skills))
