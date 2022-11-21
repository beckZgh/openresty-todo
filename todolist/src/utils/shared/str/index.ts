/** 转换单词首字母大写 */
export function upperFirst(word: string) {
    return !word ? '' : word.replace(word[0]!, word[0]!.toLocaleUpperCase())
}
