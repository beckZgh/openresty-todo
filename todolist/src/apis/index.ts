
import createApiRequest from './http'
import api_scehma       from './api'

const api_config = {
    url   : '/todo/api.ljson', // 请求 API 路径
    schema: api_scehma       , // API 定义
}

const $http = createApiRequest()
window.$api = genApiBySchema(api_config.schema, api_config.url)

// 生成对象的 api
type IApiSchema = Record<string, Record<string, string[]> | string[]>
type IApiRecord = Record<string, Record<string, Function> | Function>
function genApiBySchema(api_schema: IApiSchema, urlPrefix: string): any {
    if (!$http) return

    const api: IApiRecord = {}

    load(api_schema, api)
    function load(_api_schema: IApiSchema, _api: IApiRecord) {
        Object.keys(_api_schema).forEach((k) => {
            const val = _api_schema[k]
            if (Array.isArray(val)) {
                _api[k] = (params: Record<string, any>, config: any) => {
                    const act = val[1] ? `&act=${ val[1] }` : ''
                    const url = `${ urlPrefix }?api=${ val[0] }${ act }`
                    return $http?.post(url, params, config)
                }
            } else if (val instanceof Object) {
                _api[k] = {}
                load(val, _api[k] as IApiRecord)
            }
        })
    }

    return api
}
