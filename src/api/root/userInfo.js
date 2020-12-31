import request from '@/utils/request'
/** 用户列表
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
*/
export function a_list(data) {
    return request({
        url: '/admin/user/a_list',
        method: 'post',
        data: data
    })
}
/** 添加员工时选择的员工列表
 * key	否	string	账号名称模糊搜索
 */
export function s_list(data) {
    return request({
        url: '/admin/user/s_list',
        method: 'post',
        data: data
    })
}
/** 更改所属组
 * userId	是	string	员工id
 * groupId	是	string	管理组id
 */
export function up_user(data) {
    return request({
        url: '/admin/user/up_user',
        method: 'post',
        data: data
    })
}
/** 添加erp员工时管理组列表
 * key	否	string	账号名称模糊搜索
 */
export function add_user_group_list(data) {
    return request({
        url: '/admin/group/add_user_group_list',
        method: 'post',
        data: data
    })
}
/** 禁止账号
 * id	是	int	员工id
 */
export function prohibit_user(data) {
    return request({
        url: '/admin/user/prohibit_user',
        method: 'post',
        data: data
    })
}
/** 启用账号
 * id	是	int	员工id
 */
export function enable_user(data) {
    return request({
        url: '/admin/user/enable_user',
        method: 'post',
        data: data
    })
}
/** 添加erp员工
 * groupId	是	int	组id
 * userId	是	int	员工id
 */
export function a_add(data) {
    return request({
        url: '/admin/user/a_add',
        method: 'post',
        data: data
    })
}
/** 添加erp员工
 * id	是	int	员工id
 * password	是	string	密码 （必须是数字和字母组合）
 */
export function up_pass(data) {
    return request({
        url: '/admin/user/up_pass',
        method: 'post',
        data: data
    })
}