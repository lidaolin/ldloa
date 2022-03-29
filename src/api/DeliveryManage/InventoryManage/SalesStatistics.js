import request from '@/utils/request'

/** 商品统计
参数名	必选	类型	说明
product_id	可选	int	商品id
create_time	可选	array	时间范围 [“2022-03-01”,”2022-03-15”] ,默认当月的
 */
export function countGoods(data) {
    return request({
        url: '/stock/good_statistics/countGoods',
        method: 'post',
        data: data
    })
}