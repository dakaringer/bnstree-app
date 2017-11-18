export function pair(json, field) {
    let result = {}
    for (let obj of json) {
        result[obj._id] = obj[field]
    }
    return result
}

export function flatten(arr, key = '_id') {
    let result = arr.reduce((map, obj) => {
        map[obj[key]] = obj
        return map
    }, {})
    return result
}

//Action creator generator
export function makeActionCreator(type, ...argNames) {
    return function(...args) {
        let action = {
            type
        }
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        })
        return action
    }
}
