import request from '@/utils/request'

/** 快递公司列表
 参数名	必选	类型	说明
 name	否	string	快递公司名称
 limit	否	int	条数 默认;15
 page	否	int	页码
 */
export function kdList(data) {
    return request({
        url: '/admin/kd/index',
        method: 'post',
        data: data
    })
}

/** 新增
 参数名	必选	类型	说明
 name	是	string	物流名称
 mark	是	string	标示符
 status	否	int	是否启用1是，2否
 */
export function add(data) {
    return request({
        url: '/admin/kd/add',
        method: 'post',
        data: data
    })
}
/** 编辑
 参数名	必选	类型	说明
 id	是	int	物流id
 name	是	string	物流名称
 mark	是	string	标示符
 status	否	int	是否启用1是，2否
 */
export function edit(data) {
    return request({
        url: '/admin/kd/edit',
        method: 'post',
        data: data
    })
}

/** 修改状态
 * id	是	int	物流id
 * status	是	int	是否启用1是，2否
 */
export function status(data) {
    return request({
        url: '/admin/kd/status',
        method: 'post',
        data: data
    })
}

/** 快递公司列表(可搜索列表)
 参数名	必选	类型	说明
 name	否	string	快递公司名称
 limit	否	int	条数 默认;15
 */
export function searchKdList(data) {
    return request({
        url: '/admin/kd/simpleIndex',
        method: 'post',
        data: data
    })
}

