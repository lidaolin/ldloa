import request from '@/utils/request'
/** 商品列表
 * limit	否	int	每页数量默认15
 * page	否	int	当前页数
 * key	否	string	搜索条件
 * dbname	否	string	排序字段
 * sort	否	string	排序类型(desc or asc)
 */
export function index(data) {
    return request({
        url: '/admin/product/index',
        method: 'post',
        data: data
    })
}
/** 新增商品
 * brand_id	是	int	品牌id
 * product_name	是	string	商品名称
 * product_classify_id	是	int	商品分类id
 * cover_link_img	是	string	商品封面图
 * video_link	否	string	商品视频链接
 * explain	是	string	产品说明
 * view_text	是	array	商品详情图 [“www.adnwja.png”,”www.diahwdiwua.jpg”,”www.daiwdhiwa.png”]
 * status	否	int	商品状态 1在售 2下架 默认：1
 * attr	是	array	商品属性
 * weight	是	float	商品重量
 * long_size	是	float	商品长 cm
 * wide_size	是	float	商品宽 cm
 * high_size	是	float	商品高 cm
 * product_lock_fee	是	float	商品进货锁定价格
 * attr_id	是	int	属性id
 * val_name	是	string	属性值
 */
export function add(data) {
    return request({
        url: '/admin/product/add',
        method: 'post',
        data: data
    })
}
/** 修改商品
 * id	是	int	商品id
 * brand_id	是	int	品牌id
 * product_name	是	string	商品名称
 * product_classify_id	是	int	商品分类id
 * cover_link_img	是	string	商品封面图
 * video_link	否	string	商品视频链接
 * explain	是	string	产品说明
 * view_text	是	array	商品详情图 [“www.adnwja.png”,”www.diahwdiwua.jpg”,”www.daiwdhiwa.png”]
 * status	否	int	商品状态 1在售 2下架 默认：1
 * attr	是	array	商品属性
 * weight	是	float	商品重量
 * long_size	是	float	商品长 cm
 * wide_size	是	float	商品宽 cm
 * high_size	是	float	商品高 cm
 * product_lock_fee	是	float	商品进货锁定价格
 * attr_id	是	int	属性id
 * val_name	是	string	属性值
 */
export function edit(data) {
    return request({
        url: '/admin/product/edit',
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
        url: '/admin/product/status',
        method: 'post',
        data: data
    })
}

/** 删除
 * id	是	int	商品id
 */
export function del(data) {
    return request({
        url: '/admin/product/del',
        method: 'post',
        data: data
    })
}
/** 查看商品规格
 * product_id	是	int	商品id
 */
export function getSku(data) {
    return request({
        url: '/admin/product_sku/getSku',
        method: 'post',
        data: data
    })
}

/** 批量更新商品价格及状态
 * id_array	是	array	sku id
 ** id_array 是	int	sku id
 ** price	是	int	价格
 ** p_status	是	int	规格状态 1正常 2禁售
 */
export function changeSkuPrice(data) {
    return request({
        url: '/admin/product_sku/changeSkuPrice',
        method: 'post',
        data: data
    })
}
/** 删除商品规格
 * id	是	int	sku id
 */
export function delSku(data) {
    return request({
        url: '/admin/product_sku/delSku',
        method: 'post',
        data: data
    })
}

/** 模糊搜索列表
 * product_name	否	string	商品名称
 */
export function simpleList(data) {
    return request({
        url: '/admin/product/simpleList',
        method: 'post',
        data: data
    })
}
/** 品牌id列表
 * brand_name 名字
 */
export function brandList(data) {
    return request({
        url: '/admin/brand/index',
        method: 'post',
        data: data
    })
}
/** 商品分类id
 * classify_name 名字
 */
export function simpleIndex(data) {
    return request({
        url: '/admin/product_classify/simpleIndex',
        method: 'post',
        data: data
    })
}