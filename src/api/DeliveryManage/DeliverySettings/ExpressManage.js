import request from '@/utils/request'

/** 快递管理列表
 参数名	必选	类型	说明
 dbname	否	string	排序字段 默认：create_time
 paixu	否	string	排序顺序 默认：desc
 limit	否	int	条数 默认15
 page	否	int	页码
 */
export function expressList(data) {
    return request({
        url: '/admin/express/index',
        method: 'post',
        data: data
    })
}

/** 新增
 company_id	是	int	配送中心id
 status	否	int	是否使用1使用2不使用
 kd_id	是	int	快递公司id
 sort	否	int	排序，越大越靠前
 isappoint	否	int	是否可指定（1是2否）
 customer_name	否	string	快递鸟账号：大客户账号
 customer_password	否	string	快递鸟密码：大客户密码
 m_dayiname	否	string
 template_id	否	int	模板id
 kdn_num	否	string	快递鸟物流编号
 */
export function add(data) {
    return request({
        url: '/admin/express/add',
        method: 'post',
        data: data
    })
}
/** 编辑
 参数名	必选	类型	说明
 id	是	int	快递id
 company_id	是	int	配送中心id
 status	否	int	是否使用1使用2不使用
 kd_id	是	int	快递公司id
 sort	否	int	排序，越大越靠前
 isappoint	否	int	是否可指定（1是2否）
 customer_name	否	string	快递鸟账号：大客户账号
 customer_password	否	string	快递鸟密码：大客户密码
 m_dayiname	否	string
 template_id	否	int	模板id
 kdn_num	否	string	快递鸟物流编号
 */
export function edit(data) {
    return request({
        url: '/admin/express/edit',
        method: 'post',
        data: data
    })
}

/** 修改状态
 * id	是	int	快递配送id
 * status	是	int	是否启用1是，2否
 */
export function status(data) {
    return request({
        url: '/admin/express/status',
        method: 'post',
        data: data
    })
}

/** 快递管理中的列表(可搜索列表)
 参数名	必选	类型	说明
 kdname	否	string	快递名称
 */
export function searchKdManageList(data) {
    return request({
        url: '/admin/express/simpleList',
        method: 'post',
        data: data
    })
}

/** 查询快递价格表
 参数名	必选	类型	说明
 express_id	是	int	快递id
 */
export function queryKdPriceList(data) {
    return request({
        url: '/admin/express/checkExpressDetail',
        method: 'post',
        data: data
    })
}

/** 导入快递价格表
 参数名	必选	类型	说明
 kdid	是	int	快递id
 excel	是	file	快递价格表excel文件
 */
export function uploadKdPriceList(data) {
    return request({
        url: '/admin/express/uploadExpress',
        method: 'post',
        data: data
    })
}

