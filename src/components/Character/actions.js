import * as actionType from './actionTypes'
import i18n from '../../i18n'
import {makeActionCreator, flatten} from '../../helpers'
import {setLoading} from '../../actions'

import {setClassData, setClass, setCharacterMode} from '../Classes/actions'
import {dataSelector} from '../Classes/selectors'

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

                    document.title = `${json.general.name} - ${i18n.t(
                        'general:character'
                    )} | BnSTree`

                    let classCode = json.general.classCode
                    dispatch(setCharacterMode(true))
                    dispatch(setClass(classCode))
                    if (!dataSelector(getState()).has(classCode)) {
                        fetch(`https://api.bnstree.com/classes/${classCode}`, {
                            method: 'get',
                            credentials: 'include'
                        })
                            .then(response => response.json())
                            .then(json => {
                                if (json.success === 0 || !json.data) {
                                    return
                                }

                                let elements = json.data.classData.elements

                                let data = json.data
                                Object.keys(data).forEach(k => {
                                    if (k !== 'classData') {
                                        data[k] = flatten(data[k])
                                    }
                                })
                                data.classData = elements

                                dispatch(setClassData(classCode, data))
                            })
                            .catch(e => console.log(e))
                    }
                })
                .then(() => dispatch(setLoading(false)))
                .catch(e => console.log(e))
        }
    }
}
