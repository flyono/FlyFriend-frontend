/**
 * 日期格式化
 * @param date
 * @returns {string}
 */
export function formDate({date}: { date: any }) {
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let h =date.getHours()
    h = h < 10 ? ('0' + h) : h
    let M =date.getMinutes()
    M = M < 10 ? ('0' + M) : M
    let s =date.getSeconds()
    s = s < 10 ? ('0' + s) : s
    return  y + '年' + m + '月' + d + '日';
}