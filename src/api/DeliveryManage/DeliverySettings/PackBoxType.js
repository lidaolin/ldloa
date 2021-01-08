import request from '@/utils/request'

/** 包装箱管理列表
 参数名	必选	类型	说明
 packname	否	string	包装箱名称
 dbname	否	string	排序字段 默认：create_time
 paixu	否	string	排序顺序 默认：desc
 limit	否	int	条数 默认：15
 page	否	int	页码
 */
export function packList(data) {
    return request({
        url: '/admin/pack/index',
        method: 'post',
        data: data
    })
}

/** 新增
 参数名	必选	类型	说明
 packname	是	string	包装箱名称
 ps_company_id	是	int	配送公司id
 packnumber	否	int	最多可以装商品的数量
 remarks	否	string	备注信息
 status	否	int	是否启用1是2否
 longsize	是	float	长
 widesize	是	float	宽
 highsize	是	float	高
 */
export function add(data) {
    return request({
        url: '/admin/pack/add',
        method: 'post',
        data: data
    })
}
/** 编辑
 参数名	必选	类型	说明
 id	是	int	包装箱id
 packname	是	string	包装箱名称
 ps_company_id	是	int	配送公司id
 packnumber	否	int	最多可以装商品的数量
 remarks	否	string	备注信息
 status	否	int	是否启用1是2否
 longsize	是	float	长
 widesize	是	float	宽
 highsize	是	float	高
 */
export function edit(data) {
    return request({
        url: '/admin/pack/edit',
        method: 'post',
        data: data
    })
}

/** 修改状态
 * id	是	int	包装箱id
 * status	是	int	是否启用1是，2否
 */
export function status(data) {
    return request({
        url: '/admin/pack/status',
        method: 'post',
        data: data
    })
}

/** 删除
 参数名	必选	类型	说明
 id	是	int	包装箱id
 */
export function del(data) {
    return request({
        url: '/admin/pack/del',
        method: 'post',
        data: data
    })
}

