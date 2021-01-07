import request from '@/utils/request'
/** 生产出入库
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function index(data) {
    return request({
        url: '/admin/stock_ruku/index',
        method: 'post',
        data: data
    })
}
/** 配送单位+配送公司
 * name	否	string	配送单位名称
 * type	否	int	1配送单位 5配送公司
 */
export function getPsCompany(data) {
    return request({
        url: '/admin/Company/getPsCompany',
        method: 'post',
        data: data
    })
}
/** 新增
 * supplier_id	是	int	供应商id
 * ps_company_id	是	int	配送单位id
 * w_type	是	int	操作类型（1入库，2出库）
 * ruku_product	是	array	生产入库商品
 ** product_id	是	int	商品id
 ** product_sku_id	是	int	商品规格id
 ** number	是	int	数量
 */
export function add(data) {
    return request({
        url: '/admin/stock_ruku/add',
        method: 'post',
        data: data
    })
}
/** 编辑
 * id	是	int	出入库id
 * supplier_id	是	int	供应商id
 * ps_company_id	是	int	配送单位id
 * w_type	是	int	操作类型（1入库，2出库）
 * ruku_product	是	array	生产入库商品
 ** product_id	是	int	商品id
 ** product_sku_id	是	int	商品规格id
 ** number	是	int	数量
 */
export function edit(data) {
    return request({
        url: '/admin/stock_ruku/edit',
        method: 'post',
        data: data
    })
}
/** 提交
 * id	是	int	出入库id
 */
export function status(data) {
    return request({
        url: '/admin/stock_ruku/status',
        method: 'post',
        data: data
    })
}
/** 删除
 * id	是	int	出入库id
 */
export function del(data) {
    return request({
        url: '/admin/stock_ruku/del',
        method: 'post',
        data: data
    })
}