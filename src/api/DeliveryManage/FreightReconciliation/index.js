import request from '@/utils/request'

/** 运费对账列表
 参数名	必选	类型	说明
 dbname	否	string	排序字段 默认：createTime
 paixu	否	string	排序顺序 默认：desc
 limit	否	int	条数 默认：15
 page	否	int	页码
 */
export function freightAccountList(data) {
    return request({
        url: '/admin/ps_fee/index',
        method: 'post',
        data: data
    })
}

/** 导入对账明细
 参数名	必选	类型	说明
 express_id	是	int	快递公司id
 excel	是	file	对账明细表 excel
 */
export function importdetail(data) {
    return request({
        url: '/admin/ps_fee/importFreightDetails',
        method: 'post',
        data: data
    })
}

/** 进行对账
 参数名	必选	类型	说明
 check_id	是	int	对账id
 */
export function feecheck(data) {
    return request({
        url: '/admin/ps_fee/reconciliation',
        method: 'post',
        data: data
    })
}


/** 导出对账差异
 参数名	必选	类型	说明
 check_id	是	int	对账id
 */
export function exportresult(data) {
    return request({
        url: '/admin/ps_fee/downloadDiff',
        method: 'post',
        data: data
    })
}


/** 删除
 参数名	必选	类型	说明
 check_id	是	int	对账id
 */
export function del(data) {
    return request({
        url: '/admin/ps_fee/del',
        method: 'post',
        data: data
    })
}



