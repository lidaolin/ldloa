import request from '@/utils/request'
/** 供应商列表
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function index(data) {
    return request({
        url: '/admin/supplier/index',
        method: 'post',
        data: data
    })
}
/** 新增
 * supplier_type_id	是	int	供应商分类id
 * supplier_name	是	string	供应商名称
 * supplier_code	是	string	供应商编码
 * contact_person	否	string	联系人
 * tel	否	string	电话
 * phone	否	string	手机号
 * province	否	string	省
 * city	否	string	市
 * district	否	string	区
 * detail_address	否	string	详细地址
 * fax	否	string	传真
 * post_code	否	string	邮编
 * qq	否	string	qq
 * tax_rate	否	string	开票税率
 * wechat	否	string	微信号
 */
export function add(data) {
    return request({
        url: '/admin/supplier/add',
        method: 'post',
        data: data
    })
}
/** 编辑
 * id	是	int	供应商id
 * supplier_type_id	是	int	供应商分类id
 * supplier_name	是	string	供应商名称
 * supplier_code	是	string	供应商编码
 * contact_person	否	string	联系人
 * tel	否	string	电话
 * phone	否	string	手机号
 * province	否	string	省
 * city	否	string	市
 * district	否	string	区
 * detail_address	否	string	详细地址
 * fax	否	string	传真
 * post_code	否	string	邮编
 * qq	否	string	qq
 * tax_rate	否	string	开票税率
 * wechat	否	string	微信号
 */
export function edit(data) {
    return request({
        url: '/admin/supplier/edit',
        method: 'post',
        data: data
    })
}
/** 删除
 * id	是	int	出入库id
 */
export function del(data) {
    return request({
        url: '/admin/supplier/del',
        method: 'post',
        data: data
    })
}