import request from '@/utils/request'
/** 发货列表
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function p_list(data) {
    return request({
        url: '/admin/plfahuo/p_list',
        method: 'post',
        data: data
    })
}
/** 审核
 * ids	是	string	发货单id列表 格式1,2,3,4
 * express_id	是	int	快递公司id
 * bz_xin	是	string	包货箱型
 * remarks	否	string	备注信息
 */
export function batch_review(data) {
    return request({
        url: '/admin/plfahuo/batch_review',
        method: 'post',
        data: data
    })
}
/** 订单合并
 * ids	是	string	发货单id列表 格式1,2,3,4
 * remarks	否	string	备注信息
 */
export function p_merge(data) {
    return request({
        url: '/admin/plfahuo/p_merge',
        method: 'post',
        data: data
    })
}
/** 根据体积拆分
 * id	是	int	发货单id
 * remarks	否	string	备注信息
 */
export function p_split(data) {
    return request({
        url: '/admin/plfahuo/p_split',
        method: 'post',
        data: data
    })
}
/** 手动拆分
 * id	是	int	发货单id
 * product	是	json	商品信息 格式[{“product_id”:2,”product_sku_id”:151,”number”:5}] product_id 商品id product_sku_id 商品规格id number数量
 * remarks	否	string	备注信息
 */
export function manual_split(data) {
    return request({
        url: '/admin/plfahuo/manual_split',
        method: 'post',
        data: data
    })
}
/** 订单拦截
 * id	是	int	发货单id
 */
export function intercept(data) {
    return request({
        url: '/admin/plfahuo/intercept',
        method: 'post',
        data: data
    })
}
/** 取消拦截
 * id	是	int	发货单id
 */
export function cancel_intercept(data) {
    return request({
        url: '/admin/plfahuo/cancel_intercept',
        method: 'post',
        data: data
    })
}
/** 计算订单快递费用
 * plfahuo_id	是	int	发货单id
 */
export function orderShipping(data) {
    return request({
        url: '/admin/express/orderShipping',
        method: 'post',
        data: data
    })
}
/** 计算订单快递费用
 * plfahuo_id	是	int	发货单id
 */
export function boxSimpleList(data) {
    return request({
        url: '/admin/pack/simpleList',
        method: 'post',
        data: data
    })
}
/** 手动拆分时选择商品列表
 * id	是	int	发货单id
 */
export function manual_product_list(data) {
    return request({
        url: '/admin/plfahuo/manual_product_list',
        method: 'post',
        data: data
    })
}
/** 手动拆分时选择商品列表
 * id	是	int	发货单id
 */
export function p_back(data) {
    return request({
        url: '/admin/Plfahuo/p_back',
        method: 'post',
        data: data
    })
}