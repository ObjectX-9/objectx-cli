/**
 * 将字符串首字母大写
 * @param str 输入字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 驼峰命名转连字符命名
 * @param str 驼峰命名字符串
 * @returns 连字符命名字符串
 * @example
 * ```
 * camelToKebab('helloWorld') // 'hello-world'
 * ```
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 连字符命名转驼峰命名
 * @param str 连字符命名字符串
 * @returns 驼峰命名字符串
 * @example
 * ```
 * kebabToCamel('hello-world') // 'helloWorld'
 * ```
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 截断字符串
 * @param str 原始字符串
 * @param length 目标长度
 * @param suffix 后缀，默认为'...'
 * @returns 截断后的字符串
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
} 