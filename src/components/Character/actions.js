import * as actionType from './actionTypes'
import {makeActionCreator} from '../../helpers'
import {setLoading} from '../../actions'

import {setCharacterMode, loadClass} from '../Classes/actions'

//Action creators
const setRegion = makeActionCreator(actionType.SET_CHARACTER_REGION, 'region')
export const setTab = makeActionCreator(actionType.SET_CHARACTER_TAB, 'tab')

const loadCharacterData = makeActionCreator(actionType.SET_CHARACTER_DATA, 'characterData')

export function loadCharacter(region, name) {
    return (dispatch, getState) => {
        if (name) {
            dispatch(setLoading(true))
            dispatch(setRegion(region))
            fetch(`https://api.bnstree.com/character/${region}/${name}`, {
                method: 'get',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(json => {
                    dispatch(loadCharacterData(json))
                    if (json.success === 0 || !json.general) {
                        return
                    }

                    let classCode = json.general.classCode
                    dispatch(loadClass(classCode))
                    dispatch(setCharacterMode(true))
                })
                .then(() => dispatch(setLoading(false)))
                .catch(e => console.log(e))
        }
    }
}
