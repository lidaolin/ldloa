import request from '@/utils/request'
/** 退货原因列表
 参数名	必选	类型	说明
 dbname	否	string	排序字段 默认：create_time
 paixu	否	string	排序顺序 默认：desc
 limit	否	int	条数 默认：15
 page	否	int	页码
 */
export function index(data) {
    return request({
        url: '/admin/order_refund_reason/index',
        method: 'post',
        data: data
    })
}

/** 新增
 参数名	必选	类型	说明
 name	是	string	退货原因
 status	否	int	是否启用 1否 2是
 sort	否	int	排序
 */
export function add(data) {
    return request({
        url: '/admin/order_refund_reason/add',
        method: 'post',
        data: data
    })
}

/** 编辑
 参数名	必选	类型	说明
 参数名	必选	类型	说明
 id	是	int	退货原因id
 name	是	string	退货原因
 status	否	int	是否启用 1否 2是
 sort	否	int	排序
 */
export function edit(data) {
    return request({
        url: '/admin/order_refund_reason/edit',
        method: 'post',
        data: data
    })
}

/** 修改状态
 * id	是	int	快递配送id
 * status	是	int	是否启用1是，2否
 */
export function status(data) {
    return request({
        url: '/admin/order_refund_reason/status',
        method: 'post',
        data: data
    })
}

/** 删除
 参数名	必选	类型	说明
 id	是	int	品牌id
 */
export function del(data) {
    return request({
        url: '/admin/order_refund_reason/del',
        method: 'post',
        data: data
    })
}



