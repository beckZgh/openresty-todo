import * as shared   from './shared'
import * as notice   from './notice'
import * as location from './location'

export const Utils = window.$utils = {
    ...shared,
    ...notice,
    ...location
} as const

export default Utils
