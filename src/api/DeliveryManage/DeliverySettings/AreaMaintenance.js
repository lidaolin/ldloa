import request from '@/utils/request'

/** 区域维护列表
     参数名	必选	类型	说明
     dbname	否	string	排序字段 默认：createTime
     paixu	否	string	排序顺序 默认：desc
     limit	否	int	条数 默认：15
     page	否	int	页码
 */
export function areaServiceList(data) {
    return request({
        url: '/admin/area_service/index',
        method: 'post',
        data: data
    })
}

/** 新增
     参数名	必选	类型	说明
     companyId	是	int	配送公司id
     ps_id	是	int	快递公司id
     province	是	string	省
     city	否	string	市
     district	否	string	县、区
     issend	否	int	是否送达1:是；2:否
     remark	否	string	备注
 */
export function add(data) {
    return request({
        url: '/admin/area_service/add',
        method: 'post',
        data: data
    })
}
/** 编辑
     参数名	必选	类型	说明
     id	是	int	区域维护id
     companyId	是	int	配送公司id
     ps_id	是	int	快递公司id
     province	是	string	省
     city	否	string	市
     district	否	string	县、区
     issend	否	int	是否送达1:是；2:否
     remark	否	string	备注
 */
export function edit(data) {
    return request({
        url: '/admin/area_service/edit',
        method: 'post',
        data: data
    })
}

/** 删除
 * id	是	int	区域维护id
 */
export function del(data) {
    return request({
        url: '/admin/area_service/del',
        method: 'post',
        data: data
    })
}

/** 获取配送单位/公司
 参数名	必选	类型	说明
 name	否	string	配送单位名称
 type	否	int	1配送单位 5配送公司
 */
export function distributCompany(data) {
    return request({
        url: '/admin/Company/getPsCompany',
        method: 'post',
        data: data
    })
}
