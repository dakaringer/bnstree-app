import * as actionType from './actionTypes'
import {Map} from 'immutable'
import {makeActionCreator} from '../../helpers'
import {setLoading, setViewOption} from '../../actions'
import apollo, {q} from '../../apollo'

import {setCharacterMode, loadClass} from '../Classes/actions'

//Action creators
export const setTab = makeActionCreator(actionType.SET_CHARACTER_TAB, 'tab')
const loadCharacterData = makeActionCreator(actionType.SET_CHARACTER_DATA, 'characterData')

const characterQuery = q`query ($name: String!, $region: String!) {
    Character(name: $name, region: $region)  {
        general {
            account
            region
            name
            profileImg
            className
            classCode
            level
            server
            faction
            clan
            arena {
                stats
                solo {
                    rating
                    wins
                }
                tag {
                    rating
                    wins
                }
            }
        }
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
        userVoted
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

export function loadCharacter(region, name) {
    return dispatch => {
        if (name) {
            dispatch(setLoading(true, 'character'))
            dispatch(setViewOption('characterRegion', region))

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
                    dispatch(loadClass(classCode))
                    dispatch(setCharacterMode(true))
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
