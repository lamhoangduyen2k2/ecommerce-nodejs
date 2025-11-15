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
    const newObj = {}
    Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === undefined) {
            return
        }
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            newObj[key] = removeUndefinedObject(obj[key])
        } else {
            newObj[key] = obj[key]
        }
    })
    return newObj
}
/** 
 * const a = {
        c: {
            d: 1
        }
    }
    
    db.collection.updateOne({
        `c.d`: 1
    })
*/
export const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a]
            })
        } else {
            final[k] = obj[k]
        }
    })
    return final
}