import request from '@/utils/request'
/** 快递赔偿
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function index(data) {
    return request({
        url: '/admin/compen_sate/index',
        method: 'post',
        data: data
    })
}
/** 新增
 * deliverNum	是	string	销售单号
 * compensate_cash	是	string	赔偿金额
 * compensate_type	是	string	赔偿类型1:产品丢失；2:破损；3:超区；4:其他
 * deal_progress	否	string	处理进度
 * remark	否	string	备注说明
 */
export function add(data) {
    return request({
        url: '/admin/compen_sate/add',
        method: 'post',
        data: data
    })
}
/** 编辑
 * id	是	string	赔偿id
 * deliverNum	是	string	销售单号
 * compensate_cash	是	string	赔偿金额
 * compensate_type	是	string	赔偿类型1:产品丢失；2:破损；3:超区；4:其他
 * deal_progress	否	string	处理进度
 * remark	否	string	备注说明
 */
export function edit(data) {
    return request({
        url: '/admin/compen_sate/edit',
        method: 'post',
        data: data
    })
}