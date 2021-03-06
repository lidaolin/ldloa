import request from '@/utils/request'
/** 商品分类列表
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function index(data) {
    return request({
        url: '/admin/product_classify/index',
        method: 'post',
        data: data
    })
}
/** 新增
 * product_classify_name	是	string	品牌名称
 * status	否	int	状态1正常2禁止
 */
export function add(data) {
    return request({
        url: '/admin/product_classify/add',
        method: 'post',
        data: data
    })
}
/** 编辑
 * id	是	int	品牌id
 * product_classify_name	是	string	品牌名称
 * status	否	int	状态1正常2禁止
 */
export function edit(data) {
    return request({
        url: '/admin/product_classify/edit',
        method: 'post',
        data: data
    })
}

/** 删除
 * id	是	int	品牌id
 */
export function del(data) {
    return request({
        url: '/admin/product_classify/del',
        method: 'post',
        data: data
    })
}