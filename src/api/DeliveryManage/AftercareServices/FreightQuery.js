import request from '@/utils/request'
/** 快递赔偿
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function order_plfahuo(data) {
    return request({
        url: '/admin/order/order_plfahuo',
        method: 'post',
        data: data
    })
}