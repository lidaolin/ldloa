import request from '@/utils/request'

/** 销售总汇列表
 参数名	必选	类型	说明
 page	是	int	当前页数
 limit	是	int	分页条数
 key	否	string	高级搜索
 dbname	否	string	排序字段
 sort	否	string	排序类型
 */
export function sale_summaryt(data) {
    return request({
        url: '/stock/Summary/sale_summary',
        method: 'post',
        data: data
    })
}

export function exports(data) {
    return request({
        url: '/stock/Summary/daochu_sale_summary',
        method: 'post',
        data: data
    })
}
