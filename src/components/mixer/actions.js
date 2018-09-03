import * as actionType from './actionTypes'
import {Map, List, fromJS} from 'immutable'
import {pair, flatten, makeActionCreator} from '../shared/actionHelpers'
import {
    tabSelector,
    currentTabSelector,
    equipSelector,
    equipDataSelector,
    dataSelector,
    statOrder
} from './selector'

import {setLoading} from '../../actions'

import {message} from 'antd'

const postHeaders = {
    'Content-type': 'application/json; charset=UTF-8'
}

//Action creators
export const setClass = makeActionCreator(actionType.SET_CLASS_FILTER, 'classCode')
export const setFilter = makeActionCreator(actionType.SET_SS_FILTER, 'filter')
export const setSearchKeyword = makeActionCreator(actionType.SET_SS_SEARCH_KEYWORD, 'keyword')
export const setTab = makeActionCreator(actionType.SET_SS_TAB, 'index')

const loadSSList = makeActionCreator(actionType.LOAD_SS, 'list')

const addTab = makeActionCreator(actionType.ADD_TAB)
const deleteTab = makeActionCreator(actionType.DELETE_TAB, 'index')
const replaceTabs = makeActionCreator(actionType.REPLACE_TABS, 'tab')

const equip = makeActionCreator(actionType.EQUIP, 'index', 'piece', 'pieceData')
const unequip = makeActionCreator(actionType.UNEQUIP, 'index', 'piece')

const setSkills = makeActionCreator(actionType.SET_SKILLS, 'skills')
const setLocations = makeActionCreator(actionType.SET_LOCATIONS, 'locations')
const setTemplates = makeActionCreator(actionType.SET_SS_TEMPLATES, 'templates')

export function loadSS(lang, buildLink) {
    return (dispatch, getState) => {
        dispatch(setLoading(true))
        fetch('/api/mixer/getList', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({lang: lang})
        }).then(response => response.json()).then(json => {
            dispatch(loadSSList(flatten(json.data)))

            if (buildLink) {
                fetch('/api/mixer/loadBuild', {
                    method: 'post',
                    credentials: 'include',
                    headers: postHeaders,
                    body: JSON.stringify({link: buildLink})
                }).then(response => response.json()).then(json => {
                    if (json.equipData) {
                        dispatch(replaceTabs(json.equipData))
                    }
                    else {
                        dispatch(addTab())
                    }
                })
            }
            else if (tabSelector(getState()).size === 0) {
                dispatch(addTab())
            }
            dispatch(setLoading(false))
        })
    }
}

export function loadTextData(lang) {
    return (dispatch) => {
        fetch('/api/mixer/getTextData', {
            method: 'post',
            credentials: 'include',
            headers: postHeaders,
            body: JSON.stringify({lang: lang})
        }).then(response => response.json()).then(json => {
            dispatch(setSkills(flatten(json.ref)))
            dispatch(setLocations(flatten(json.locations)))
            dispatch(setTemplates(pair(json.templates, 'template')))
        })
    }
}

export function addEquipTab() {
    return function(dispatch, getState) {
        let size = tabSelector(getState()).size
        dispatch(addTab())
        dispatch(setTab(size))
    }
}

export function deleteEquipTab(index) {
    return function(dispatch, getState) {
        let size = tabSelector(getState()).size
        if (size === 1) {
            return
        }

        dispatch(deleteTab(index))
        let currentTab = currentTabSelector(getState())
        let newIndex = currentTab
        if (index == currentTab) {
            newIndex = size - 2
        } else if (index < currentTab) {
            newIndex = currentTab - 1
        }

        dispatch(setTab(newIndex))
    }
}

export function toggleEquip(piece, id, error) {
    return function(dispatch, getState) {
        let currentTab = currentTabSelector(getState())
        let currentTabData = equipDataSelector(getState())
        let setData = dataSelector(getState())

        if (currentTabData.getIn([piece, 'id']) != id) {
            if (setData.hasIn([id, 'classRestriction'])) {
                let resClass = setData.getIn([id, 'classRestriction'])
                let restricted = false
                currentTabData.forEach(d => {
                    if (d) {
                        let res = setData.getIn([d.get('id'), 'classRestriction'])
                        restricted = res && res != resClass
                        return !restricted
                    }
                })
                if (restricted) {
                    message.error(error, 5)
                    return
                }
            }

            let statValues = []
            let limit = setData.getIn([id, 'pieceData', piece, 'sub', 'limit'], 1)
            let subStats = setData.getIn([id, 'pieceData', piece, 'sub', 'stats'], List()).sort((a, b) => {
                return statOrder.indexOf(a) - statOrder.indexOf(b)
            })
            for (let i = 0; i < limit; i++) {
                let max = subStats.get(i) != 'health' ?
                    setData.getIn([id, 'pieceData', piece, 'sub', 'values'], List([0])).sort().last() :
                    setData.getIn([id, 'pieceData', piece, 'sub', 'healthValues'], List([0])).sort().last()

                statValues.push([subStats.get(i), max])
            }

            let m1Value = setData.getIn([id, 'pieceData', piece, 'm1'], List([0])).sort().last()
            let m2Value = setData.getIn([id, 'pieceData', piece, 'm2', 'values'], List([0])).sort().last()
            if (setData.getIn([id, 'pieceData', piece, 'm2', 'stat']) == 'health') {
                m1Value += m2Value * 10
                m2Value = 0
            }

            let pieceData = {
                id: id,
                setId: setData.getIn([id, 'setId']),
                equipGrade: setData.getIn([id, 'grade']),
                m1Value: m1Value,
                m2Value: m2Value,
                sub: statValues,
                fuse: {
                    stat: 'none',
                    value: setData.getIn([id, 'pieceData', piece, 'maxFuse'], 0)
                }
            }

            dispatch(equip(currentTab, piece, fromJS(pieceData)))
        }
        else {
            dispatch(unequip(currentTab, piece))
        }
    }
}

export function unequipPiece(piece) {
    return function(dispatch, getState) {
        let currentTab = currentTabSelector(getState())
        dispatch(unequip(currentTab, piece))
    }
}

export function setStat(piece, type, value, subStat=null) {
    return function(dispatch, getState) {
        if (!isNaN(value)) {
            let currentTab = currentTabSelector(getState())
            let pieceData = equipDataSelector(getState()).get(piece)

            if (!subStat) {
                pieceData = pieceData.set(type, value)
            }
            else {
                if (type == 'fusion') {
                    pieceData = pieceData.setIn(['fuse', 'value'], value)
                    pieceData = pieceData.setIn(['fuse', 'stat'], subStat)
                }
                else {
                    pieceData = pieceData.setIn(['sub', type, 1], value)
                }
            }

            dispatch(equip(currentTab, piece, pieceData))
        }
    }
}

export function changeSubStat(piece, index, stat) {
    return function(dispatch, getState) {
        let currentTab = currentTabSelector(getState())
        let pieceData = equipDataSelector(getState()).get(piece)

        pieceData = pieceData.setIn(['sub', index, 0], stat)

        dispatch(equip(currentTab, piece, pieceData))
    }

}

export function setFuse(piece, stat, value) {
    return (dispatch, getState) => {
        let p = equipSelector(getState()).get(piece)

        if (!p.equals(Map())) {
            p = p.setIn(['fuse', 'attribute'], stat),
            p = p.setIn(['fuse', 'value'], value)
            dispatch(equip(piece, p))
        }
    }
}
