import * as actionType from './actionTypes'
import {Map} from 'immutable'
import {makeActionCreator} from '../../helpers'
import {setLoading, setViewOption, setRecentSearch} from '../../actions'
import apollo, {q} from '../../apollo'

import {setCharacterMode, loadSkills, selectPatch} from '../Skills/actions'
import {patchListSelector} from '../References/selectors'

//Action creators
export const setTab = makeActionCreator(actionType.SET_CHARACTER_TAB, 'tab')
const loadCharacterData = makeActionCreator(actionType.SET_CHARACTER_DATA, 'characterData')

const characterQuery = q`query ($name: String!, $region: String!) {
    Character(name: $name, region: $region)  {
        general
        statData: stats
        skillData: skills {
            elementIndex
            build
        }
        otherCharacters {
            account
            list
        }
        equipData: equipment
        characterVotes: votes
        userVoted,
        achievements {
            icon
            title
            grade
        }
    }
}`

const voteMutation = q`mutation ($region: String!, $name: String!) {
    Character (region: $region, name: $name) {
        vote
    }
}`

const unvoteMutation = q`mutation ($region: String!, $name: String!) {
    Character (region: $region, name: $name) {
        unvote
    }
}`

const recentSearchMutation = q`mutation ($region: String!, $name: String!) {
    User {
        addRecentSearch (region: $region, name: $name) {
            name
            region
        }
    }
}`

export function loadCharacter(region, name, history) {
    return (dispatch, getState) => {
        if (name) {
            dispatch(setLoading(true, 'character'))
            dispatch(setViewOption('characterRegion', region))

            if (history) {
                history.push(`/character/${region}/${name}`)
            }

            apollo
                .query({
                    query: characterQuery,
                    variables: {
                        region: region,
                        name: name
                    }
                })
                .then(json => {
                    let data = json.data.Character
                    let classCode = data.general.classCode

                    dispatch(loadCharacterData(data))
                    dispatch(loadSkills(classCode))
                    dispatch(setCharacterMode(true))
                    if (region === 'kr') {
                        let krPatch = patchListSelector(getState())
                            .last()
                            .get('_id')
                        dispatch(selectPatch(krPatch.toString()))
                    }

                    apollo
                        .mutate({
                            mutation: recentSearchMutation,
                            variables: {
                                region: data.general.region,
                                name: data.general.name
                            }
                        })
                        .then(json => {
                            dispatch(setRecentSearch(json.data.User.addRecentSearch))
                        })
                        .catch(e => console.error(e))
                })
                .catch(e => {
                    console.error(e)
                    dispatch(loadCharacterData(Map()))
                })
                .then(() => dispatch(setLoading(false, 'character')))
        }
    }
}

export function vote(region, name, vote = true) {
    let mutation = vote ? voteMutation : unvoteMutation
    apollo
        .mutate({
            mutation: mutation,
            variables: {
                region: region,
                name: name
            }
        })
        .catch(e => console.error(e))
}
