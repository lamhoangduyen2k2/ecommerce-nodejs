import _ from "lodash"

export const getInfoData = ({ fields = [], object = {}}) => {
    return _.pick(object, fields)
}

// ['a', 'b'] = { a: 1, b: 1}
export const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

export const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

export const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] === null) {
            delete obj[k]
        }
    })

    return obj
}