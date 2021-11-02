import request from '@/utils/request'
/** 退货申请列表
 参数名	必选	类型	说明
 dbname	否	string	排序字段 默认：create_time
 paixu	否	string	排序顺序 默认：desc
 limit	否	int	条数 默认：15
 page	否	int	页码
 */
export function index(data) {
    return request({
        url: '/admin/order_refund/index',
        method: 'post',
        data: data
    })
}

/** 退换货客户信息
 参数名	必选	类型	说明
 customer_id	是	int	客户id
 */
export function customerInfo(data) {
    return request({
        url: '/admin/order_refund/refund_customer',
        method: 'post',
        data: data
    })
}

/** 原订单信息
 参数名	必选	类型	说明
 id	是	int	退款id
 */
export function orderInfo(data) {
    return request({
        url: '/admin/order_refund/refundOriginalOrder',
        method: 'post',
        data: data
    })
}

/** 审核
 参数名	必选	类型	说明
 id	是	int	审核id
 apply_status	是	int	审核状态 2客服受理 3客服驳回
 */
export function toExamine(data) {
    return request({
        url: '/admin/order_refund/refundReview',
        method: 'post',
        data: data
    })
}

/** 审核
 参数名	必选	类型	说明
 id	是	int	审核id
 */
export function log(data) {
    return request({
        url: '/admin/order_refund/log',
        method: 'post',
        data: data
    })
}

/** 确认退款
 参数名	必选	类型	说明
 id	是	int	审核id
 */
export function refund(data) {
    return request({
        url: '/admin/order_refund/refund',
        method: 'post',
        data: data
    })
}

/** 确认退换
 参数名	必选	类型	说明
 id	是	int	审核id
 */
export function replace(data) {
    return request({
        url: '/admin/order_refund/replace',
        method: 'post',
        data: data
    })
}


/** 客服撤销
参数名	必选	类型	说明
id	是	int	退货单id
remark	否	string	备注信息
 */
export function cancelRefund(data) {
    return request({
        url: '/admin/order_refund/cancelRefund',
        method: 'post',
        data: data
    })
}
