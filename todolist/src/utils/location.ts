/** 获取 websocket 域名 */
export function getWsHost() {
    const { protocol, hostname } = window.location
    const wsProtocol = (protocol === 'https:' && 'wss://') || 'ws://'
    return `${ wsProtocol }${ hostname }`
}

/** 获取域名 */
export const getHost = () => {
    const { protocol, hostname } = window.location
    return `${ protocol }//${ hostname }`
}
