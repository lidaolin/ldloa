import request from '@/utils/request'
/** 发货列表
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function d_list(data) {
    return request({
        url: '/admin/Deliver_Plfahuo/d_list',
        method: 'post',
        data: data
    })
}
/** 获取电子面单返回打印数据
 * plfahuo_code	是	array	批量发货单号 [“8882906”,”8791517”]
 */
export function getCloudNumber(data) {
    return request({
        url: '/admin/cainiao_link/getCloudNumber',
        method: 'post',
        data: data
    })
}
/** 根据快递单号获取发货单信息
 * express_code	是	string	快递单号
 */
export function get_express_view(data) {
    return request({
        url: '/admin/Deliver_Plfahuo/get_express_view',
        method: 'post',
        data: data
    })
}
/** 扫码发货
 * id	是	int	发货单id
 * shizong	是	float	实重
 * fahuo_fieight	否	float	发货运费（不传或传0时系统自动计算运费）
 */
export function code_deliver(data) {
    return request({
        url: '/admin/Deliver_Plfahuo/code_deliver',
        method: 'post',
        data: data
    })
}
