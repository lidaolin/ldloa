import request from '@/utils/request'

/** 库存总汇列表
 参数名	必选	类型	说明
 page	是	int	当前页数
 limit	是	int	分页条数
 key	否	string	高级搜索
 dbname	否	string	排序字段
 sort	否	string	排序类型
 */
export function stockSummaryList(data) {
    return request({
        url: '/stock/Summary/s_list',
        method: 'post',
        data: data
    })
}

