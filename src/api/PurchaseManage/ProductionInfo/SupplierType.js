import request from '@/utils/request'
/** 供应商分类列表
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function index(data) {
    return request({
        url: '/admin/supplier_type/index',
        method: 'post',
        data: data
    })
}
/** 新增
 * supplier_code	是	string	分类编码
 * supplier_type_name	是	string	分类名称
 */
export function add(data) {
    return request({
        url: '/admin/supplier_type/add',
        method: 'post',
        data: data
    })
}
/** 编辑
 * id	是	int	分类id
 * supplier_code	是	string	分类编码
 * supplier_type_name	是	string	分类名称
 */
export function edit(data) {
    return request({
        url: '/admin/supplier_type/edit',
        method: 'post',
        data: data
    })
}
/** 删除
 * id	是	int	分类id
 */
export function del(data) {
    return request({
        url: '/admin/supplier_type/del',
        method: 'post',
        data: data
    })
}