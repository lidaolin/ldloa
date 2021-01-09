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