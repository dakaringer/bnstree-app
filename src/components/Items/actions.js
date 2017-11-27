import * as actionType from './actionTypes'
import apollo, {q} from '../../apollo'

import {makeActionCreator, flatten} from '../../helpers'
import {setLoading, setViewOption} from '../../actions'
import {dataSelector} from './selectors'

const setType = makeActionCreator(actionType.ITEM_UI_SET_TYPE, 'itemType')
export const setSearch = makeActionCreator(actionType.ITEM_UI_SET_SEARCH, 'search')
export const setPatch = makeActionCreator(actionType.ITEM_UI_SET_PATCH, 'patch')

const setItemData = makeActionCreator(actionType.ITEM_DATA_SET_DATA, 'itemType', 'data')

const setSkillNames = makeActionCreator(actionType.ITEM_REF_SET_SKILL_NAMES, 'language', 'nameData')
const setItemNames = makeActionCreator(actionType.ITEM_REF_SET_ITEM_NAMES, 'language', 'nameData')

const itemsQuery = q`query ($type: String!) {
    Items {
        itemData (type: $type)
        itemVotes (type: $type) {
            _id
            count
        }
        userVotes: userVotes2(type: $type) {
            _id
            count
        }
    }
}`

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

const voteMutation = q`mutation (
    $item: String!,
    $classCode: String!,
    $element: String!
) {
    Items {
        vote(
            item: $item,
            classCode: $classCode,
            element: $element
        )
    }
}`

const unvoteMutation = q`mutation (
    $item: String!,
    $classCode: String!,
    $element: String!
) {
    Items {
        unvote(
            item: $item,
            classCode: $classCode,
            element: $element
        )
    }
}`

export function loadItems(type) {
    return (dispatch, getState) => {
        dispatch(setType(type))
        dispatch(setSearch(''))

        if (!dataSelector(getState()).has(type)) {
            dispatch(setLoading(true, 'items'))
        }
        apollo
            .query({
                query: itemsQuery,
                variables: {
                    type: type
                }
            })
            .then(json => {
                let data = {
                    data: flatten(json.data.Items.itemData)
                }
                if (type !== 'soulshield') {
                    data.voteData = flatten(json.data.Items.itemVotes)
                    data.userVoteData = flatten(json.data.Items.userVotes)
                }
                dispatch(setItemData(type, data))
            })
            .catch(e => console.error(e))
            .then(() => dispatch(setLoading(false, 'items')))
    }
}

export function loadTextData(lang) {
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

export function vote(item, element, classCode, vote = true) {
    let mutation = vote ? voteMutation : unvoteMutation
    apollo
        .mutate({
            mutation: mutation,
            variables: {
                item: item,
                element: element,
                classCode: classCode
            },
            fetchPolicy: 'network-only'
        })
        .catch(e => console.error(e))
}

export function setFilter(classCode, filter) {
    return dispatch => {
        dispatch(
            setViewOption('itemFilter', {
                classCode: classCode,
                filter: filter
            })
        )
    }
}
