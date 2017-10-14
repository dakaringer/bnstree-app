import * as actionType from './actionTypes'
import {makeActionCreator} from './helpers'
import i18n from './i18n'
import {currentLanguageSelector} from './selectors'
import apollo, {q} from './apollo'

const setLanguage = makeActionCreator(actionType.GENERAL_SET_LANGUAGE, 'language')
const setUser = makeActionCreator(actionType.GENERAL_SET_USER, 'user')
const setView = makeActionCreator(actionType.GENERAL_SET_VIEW, 'view')
const setViewContext = makeActionCreator(actionType.GENERAL_SET_VIEW_CONTEXT, 'context', 'value')
const setSupportedLanguages = makeActionCreator(
    actionType.GENERAL_SET_SUPPORTED_LANGUAGES,
    'languages'
)
export const setLoading = makeActionCreator(actionType.GENERAL_SET_LOADING, 'loading', 'context')
const setLoadingApp = makeActionCreator(actionType.GENERAL_SET_LOADING_APP, 'loading')

const initialQuery = q`query ($language: String!) {
    User {
		userData: user {
			displayName
			profilePic
            displayName
            role {
                type
                translator
            }
        }
        view {
            skillMode
            skillOrder
            skillVisibility
            marketRegion
            characterRegion
        }
        loggedIn
        language (language: $language)
    }
    Languages {
        supportedLanguages {
            _id
            name
        }
    }
}`

const languageMutation = q`mutation ($language: String!) {
    User {
        setLanguage(language: $language)
    }
}`

const viewMutation = q`mutation (
    $skillMode: String
    $skillOrder: String
    $skillVisibility: String
    $marketRegion: String
    $characterRegion: String
) {
    User {
        setView(
            skillMode: $skillMode
            skillOrder: $skillOrder
            skillVisibility: $skillVisibility
            marketRegion: $marketRegion
            characterRegion: $characterRegion
        )
    }
}`

export function initialize(language) {
    return (dispatch, getState) => {
        apollo
            .query({
                query: initialQuery,
                variables: {
                    language: language
                }
            })
            .then(json => {
                dispatch(setUser(json.data.User.userData))
                dispatch(setView(json.data.User.view))
                dispatch(setLanguage(json.data.User.language))
                dispatch(setSupportedLanguages(json.data.Languages.supportedLanguages))
                i18n.changeLanguage(json.data.User.language)
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setLoadingApp(false)))
    }
}

export function setUILanguage(language) {
    return (dispatch, getState) => {
        let previousLanguage = currentLanguageSelector(getState()) || 'en'

        dispatch(setLanguage(language))
        apollo
            .mutate({
                mutation: languageMutation,
                variables: {language: language}
            })
            .then(json => {
                i18n.changeLanguage(json.data.User.setLanguage)
                dispatch(setLanguage(json.data.User.setLanguage))
            })
            .catch(e => {
                console.error(e)
                i18n.changeLanguage(previousLanguage)
                dispatch(setLanguage(previousLanguage))
            })
    }
}

export function setViewOption(option, value) {
    return (dispatch, getState) => {
        dispatch(setViewContext(option, value))

        let variables = {}
        variables[option] = value
        apollo
            .mutate({
                mutation: viewMutation,
                variables: variables
            })
            .catch(e => console.error(e))
    }
}
