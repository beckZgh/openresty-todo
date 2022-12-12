/** 对象转 query */
export const objToQuery = function (obj:  Record<string, string | number>) {
    let query = ''
    if (!obj || !Object.keys(obj).length) return query

    Object.keys(obj).forEach((k) => {
        if (obj[k]) query += query ? `&${ k }=${ obj[k] }` : `${ k }=${ obj[k] }`
    })

    return query ? `?${ query }` : query
}

/** query 转对象 */
export const queryToObj = function (query: string) {
    const obj: Record<string, string> = {}
    if (!query) return obj

    query.split('&').forEach((q) => {
        if (!q) return

        const [key, val] = q.split('=')
        if (key && val !== undefined) {
            obj[encodeURIComponent(key)] = encodeURIComponent(val)
        }
    })

    return obj
}



const o = { a: 1, b: 2 }

type O = keyof typeof o

const O1: Record<O, any> = {}

Object.keys(o).forEach(k => {
    O1[k] = o[k]
})
