export function pair(json, field) {
    let result = {}
    for (let obj of json) {
        result[obj._id] = obj[field]
    }
    return result
}

export function flatten(json) {
    let result = {}
    for (let obj of json) {
        result[obj._id] = obj
        delete obj._id
    }
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
