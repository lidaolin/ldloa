import request from '@/utils/request'

/** 代理进货列表
 参数名	必选	类型	说明
 limit	否	int	每页数量默认15
 page	否	int	当前页数
 key	否	string	搜索条件
 dbname	否	string	排序字段
 sort	否	string	排序类型(desc or asc)
 */
export function purchasingAgentList(data) {
    return request({
        url: '/stock/Purchase/p_list',
        method: 'post',
        data: data
    })
}

/** 新增
 参数名	必选	类型	说明
 company_id	是	int	进货单位id
 b_company_id	是	int	发货单位id
 freight_type	是	int	运费承担方（1进货方承担运费，2发货方承担运费）
 p_data	是	int	进货日期
 product	是	json	商品信息
 注：
 product 格式示例
 [{“product_id”:5,”number”:100,”product_sku_id”:142},{“product_id”:5,”number”:50,”product_sku_id”:143}]
 */
export function add(data) {
    return request({
        url: '/stock/Purchase/p_add',
        method: 'post',
        data: data
    })
}

/** 编辑
 参数名	必选	类型	说明
 company_id	是	int	进货单位id
 b_company_id	是	int	发货单位id
 freight_type	是	int	运费承担方（1进货方承担运费，2发货方承担运费）
 p_data	是	int	进货日期
 product	是	json	商品信息
 注：
 product 格式示例
 [{“product_id”:5,”number”:100,”product_sku_id”:142},{“product_id”:5,”number”:50,”product_sku_id”:143}]
 */
export function edit(data) {
    return request({
        url: '/stock/Purchase/p_update',
        method: 'post',
        data: data
    })
}

/** 提交
 参数名	必选	类型	说明
 id	是	int	进货单id
 remarks	否	string	提交备注
 */
export function purchaseSubmit(data) {
    return request({
        url: '/stock/Purchase/p_submit',
        method: 'post',
        data: data
    })
}

/** 确认
 参数名	必选	类型	说明
 id	是	int	进货单id
 remarks	否	string	提交备注
 */
export function purchaseConfirm(data) {
    return request({
        url: '/stock/Purchase/p_affirm',
        method: 'post',
        data: data
    })
}

/** 发货
 参数名	必选	类型	说明
 id	是	int	进货单id
 freight	是	string	运费
 express_name	是	string	快递公司
 express_code	是	string	快递单号
 case_number	是	int	箱数
 weight	是	int	重量
 remarks	否	string	备注
 */
export function purchaseDeliver(data) {
    return request({
        url: '/stock/Purchase/p_send',
        method: 'post',
        data: data
    })
}

/** 签收
 参数名	必选	类型	说明
 id	是	int	进货单id
 remarks	否	string	备注
 */
export function purchaseSign(data) {
    return request({
        url: '/stock/Purchase/p_sign',
        method: 'post',
        data: data
    })
}

/** 返回
 参数名	必选	类型	说明
 id	是	int	进货单id
 remarks	否	string	备注
 */
export function purchaseBack(data) {
    return request({
        url: '/stock/Purchase/p_back',
        method: 'post',
        data: data
    })
}

/** 删除
 参数名	必选	类型	说明
 id	是	int	进货单id
 */
export function del(data) {
    return request({
        url: '/stock/Purchase/p_del',
        method: 'post',
        data: data
    })
}

/** 进货单位(搜索列表)
 参数名	必选	类型	说明
 key	否	string	搜索关键词
 */
export function searchPurchaseList(data) {
    return request({
        url: '/stock/purchase/jh_company',
        method: 'post',
        data: data
    })
}

/** 发货单位(搜索列表)
 参数名	必选	类型	说明
 key	否	string	搜索关键词
 */
export function searchDeliverList(data) {
    return request({
        url: '/stock/purchase/fh_company',
        method: 'post',
        data: data
    })
}

//编辑从这里拿数据
/** 发货单位(搜索列表)
 参数名	必选	类型	说明
 id	    是	int	进货单id
 */
export function editDetailed(id) {
    return request({
        url: '/stock/Purchase/p_update',
        method: 'get',
        params: {id}
    })
}