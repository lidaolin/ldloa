import request from '@/utils/request'
/** 退货原因责任划分列表
 参数名	必选	类型	说明
 limit	否	int	条数 默认：15
 page	否	int	页码
 */
export function index(data) {
    return request({
        url: '/admin/order_refund_case/index',
        method: 'post',
        data: data
    })
}

/** 新增
 参数名	必选	类型	说明
 cause_name	是	string	原因说明
 f_duty	是	folate	发货方责任
 c_duty	是	folate	成交方责任
 z_duty	是	folate	总部责任
 */
export function add(data) {
    return request({
        url: '/admin/order_refund_case/add',
        method: 'post',
        data: data
    })
}

/** 编辑
 参数名	必选	类型	说明
 id	是	int	原因id
 cause_name	是	string	原因说明
 f_duty	是	folate	发货方责任
 c_duty	是	folate	成交方责任
 z_duty	是	folate	总部责任
 */
export function edit(data) {
    return request({
        url: '/admin/order_refund_case/edit',
        method: 'post',
        data: data
    })
}


