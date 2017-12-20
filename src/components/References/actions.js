import * as actionType from './actionTypes'
import apollo, {q} from '../../apollo'
import {makeActionCreator, flatten} from '../../helpers'
import {setLoading} from '../../actions'

const setPatchList = makeActionCreator(actionType.REF_SET_PATCH_LIST, 'list')
const setSkillNames = makeActionCreator(actionType.REF_SET_SKILL_NAMES, 'language', 'nameData')
const setItemNames = makeActionCreator(actionType.REF_SET_ITEM_NAMES, 'language', 'nameData')

const namesQuery = q`query ($language: String!, $en: Boolean!) {
    Skills {
        names(language: $language) {
            skills {
                _id
                name
                icon
            }
            items {
                _id
                name
                effect
                icon
            }
        }
        enNames: names(language: "en") @skip(if: $en) {
            skills {
                _id
                name
                icon
            }
            items {
                _id
                name
                effect
                icon
            }
        }
    }
}`

const patchListQuery = q`query {
    Patches {
        patchList {
            _id
            name
            base
        }
    }
}`

export function loadNameData(lang) {
    return (dispatch, getState) => {
        apollo
            .query({
                query: namesQuery,
                variables: {
                    language: lang,
                    en: lang === 'en'
                }
            })
            .then(json => {
                dispatch(setSkillNames(lang, flatten(json.data.Skills.names.skills)))
                dispatch(setItemNames(lang, flatten(json.data.Skills.names.items)))

                if (json.data.Skills.enNames) {
                    dispatch(setSkillNames('en', flatten(json.data.Skills.enNames.skills)))
                    dispatch(setItemNames('en', flatten(json.data.Skills.enNames.items)))
                }
            })
            .catch(e => console.error(e))
    }
}

export function loadPatchList() {
    return dispatch => {
        dispatch(setLoading(true, 'reference'))
        apollo
            .query({
                query: patchListQuery
            })
            .then(json => {
                dispatch(setPatchList(json.data.Patches.patchList))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setLoading(false, 'reference')))
    }
}
