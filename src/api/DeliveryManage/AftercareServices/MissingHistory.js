import request from '@/utils/request'
/** 漏发列表
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function index(data) {
    return request({
        url: '/admin/leak/index',
        method: 'post',
        data: data
    })
}
/** 新增
 * userId	是	int	成功员工id
 * addressee	是	string	收件人
 * phone	是	string	电话
 * tel	否	string	固话
 * province	是	string	省
 * city	是	string	市
 * area	是	string	区
 * address	是	string	详细地址
 * reason	否	string	原因
 */
export function add(data) {
    return request({
        url: '/admin/leak/add',
        method: 'post',
        data: data
    })
}
/** 新增
 * id	是	int	漏发历史id
 * userId	是	int	成功员工id
 * addressee	是	string	收件人
 * phone	是	string	电话
 * tel	否	string	固话
 * province	是	string	省
 * city	是	string	市
 * area	是	string	区
 * address	是	string	详细地址
 * reason	否	string	原因
 */
export function edit(data) {
    return request({
        url: '/admin/leak/edit',
        method: 'post',
        data: data
    })
}
/** 删除
 * id	是	int	漏发历史id
 */
export function del(data) {
    return request({
        url: '/admin/leak/del',
        method: 'post',
        data: data
    })
}
/** 查看操作日志
 * id	是	int	漏发历史id
 */
export function checkLog(data) {
    return request({
        url: '/admin/leak/checkLog',
        method: 'post',
        data: data
    })
}
/** 查看操作日志
 * name	否	string	搜索名称
 * limit	否	int	条数 默认：20
 */
export function getStaff(data) {
    return request({
        url: '/admin/admin/getStaff',
        method: 'post',
        data: data
    })
}