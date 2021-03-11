import request from '@/utils/request'
/** 组合商品列表
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function index(data) {
    return request({
        url: '/admin/product_combination/index',
        method: 'post',
        data: data
    })
}
/** 删除
 * id	是	int	商品id
 */
export function del(data) {
    return request({
        url: '/admin/product_combination/index',
        method: 'post',
        data: data
    })
}
/** 修改状态
 * id	是	int	商品id
 * status	是	int	商品状态 1在售 2下架’
 */
export function status(data) {
    return request({
        url: '/admin/product_combination/status',
        method: 'post',
        data: data
    })
}
/** 编辑
 * id	是	int	商品id
 * brand_id	是	int	品牌id
 * product_name	是	string	商品名称
 * product_classify_id	是	int	商品分类id
 * cover_link_img	是	string	商品封面图
 * product_carousel_img	是	array	商品轮播图 [“www.adnwja.png”,”www.diahwdiwua.jpg”,”www.daiwdhiwa.png”]
 * video_link	否	string	商品视频链接
 * explain	是	string	产品说明
 * view_text	是	array	商品详情图 [“www.adnwja.png”,”www.diahwdiwua.jpg”,”www.daiwdhiwa.png”]
 * product_carousel_img	是	array	商品轮播图 [“www.adnwja.png”,”www.diahwdiwua.jpg”,”www.daiwdhiwa.png”]
 * status	否	int	商品状态 1在售 2下架 默认：1
 * product_combination	否	array	组合商品
 */
export function edit(data) {
    return request({
        url: '/admin/product_combination/edit',
        method: 'post',
        data: data
    })
}
/** 新增
 * brand_id	是	int	品牌id
 * product_name	是	string	商品名称
 * product_classify_id	是	int	商品分类id
 * cover_link_img	是	string	商品封面图
 * product_carousel_img	是	array	商品轮播图 [“www.adnwja.png”,”www.diahwdiwua.jpg”,”www.daiwdhiwa.png”]
 * video_link	否	string	商品视频链接
 * explain	是	string	产品说明
 * view_text	是	array	商品详情图 [“www.adnwja.png”,”www.diahwdiwua.jpg”,”www.daiwdhiwa.png”]
 * product_carousel_img	是	array	商品轮播图 [“www.adnwja.png”,”www.diahwdiwua.jpg”,”www.daiwdhiwa.png”]
 * status	否	int	商品状态 1在售 2下架 默认：1
 * product_combination	否	array	组合商品
 */
export function add(data) {
    return request({
        url: '/admin/product_combination/add',
        method: 'post',
        data: data
    })
}