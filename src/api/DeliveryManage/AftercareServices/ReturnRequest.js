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

/** 搜索订单
参数名	必选	类型	说明
order_code	是	string	订单号
 */
export function searchOrder(data) {
    return request({
        url: '/admin/order_refund/searchOrder',
        method: 'post',
        data: data
    })
}

/** 申请原因列表
参数名	必选	类型	说明
order_code	是	string	订单号
 */
export function refundReason() {
    return request({
        url: '/admin/order_refund/refundReason',
        method: 'post',
        data: {}
    })
}

/** 退款责任列表
参数名	必选	类型	说明
order_code	是	string	订单号
 */
export function returnReason() {
    return request({
        url: '/admin/order_refund/returnReason',
        method: 'post',
        data: {}
    })
}

/** 录入售后
参数名	必选	类型	说明
order_code	是	string	订单号
apply_type	是	int	申请类型 1退款（无须退货） 2退款退货 3换货
receipt_status	是	int	收货状态 1未收到货 2已收到货（仅针对退款）
refund_reason_id	是	int	申请原因id
return_reason_id	是	int	退款原因id
liability_amount	是	float	退货责任金
refund_product	是	array	售后商品
refund_money	可选	float	退款金额 用户可修改
refund_reason_mark	可选	string	售后备注
refund_reason_image	可选	array	退款凭证图片
refund_product 参数
参数名	必选	类型	说明
id	是	int	订单商品id
product_id	是	int	商品id
number	是	int	售后数量
attr_val_ids	是	array	商品规格 [“519”,”520”,”521”,”522”,”540”]
shop_type	是	int	商品类型 1-普通商品 2-加购商品
 */
export function addRefund(data) {
    return request({
        url: '/admin/order_refund/addRefund',
        method: 'post',
        data: data
    })
}