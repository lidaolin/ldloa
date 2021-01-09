import request from '@/utils/request'

/** 库存总汇列表
 参数名	必选	类型	说明
 page	否	int	当前页数
 limit	否	int	分页条数
 dbname	否	varchar	排序字段
 sort	否	varchar	排序类型
 key	否	json	高级搜索
 */
export function stockCheckList(data) {
    return request({
        url: '/stock/pandian/pd_index',
        method: 'post',
        data: data
    })
}

/** 新增
 参数名	必选	类型	说明
 company_id	是	int	配送单位id
 product_id	是	int	商品id
 product_sku_id	是	int	商品规格id
 manyorless	是	int	多或少 1多2少
 number	是	int	数量
 responsible	是	int	责任方（1本单位2为总部）
 reason	是	int	原因（1，产品过期，2，产品损坏，3.保管不善，4运输损坏,5总部申请，6活动盘点）
 remarks	否	varchar	备注信息
 */
export function add(data) {
    return request({
        url: '/stock/pandian/pd_add',
        method: 'post',
        data: data
    })
}

/** 根据id获取详情
 参数名	必选	类型	说明
 id	是	int	盘点单id
 */
export function getDetails(id) {
    return request({
        url: '/stock/pandian/pd_update',
        method: 'get',
        params: {id}
    })
}

/** 编辑
 参数名	必选	类型	说明
 id	是	int	盘点单id
 company_id	是	int	配送单位id
 product_id	是	int	商品id
 product_sku_id	是	string	商品规格id
 manyorless	是	int	多或少 1多2少
 number	是	int	数量
 responsible	是	int	责任方（1本单位2为总部）
 reason	是	int	原因（1，产品过期，2，产品损坏，3.保管不善，4运输损坏,5总部申请，6活动盘点）
 remarks	否	varchar	备注信息
 */
export function edit(data) {
    return request({
        url: '/stock/pandian/pd_update',
        method: 'post',
        data: data
    })
}

/** 提交
 参数名	必选	类型	说明
 id	是	int	盘点单id
 remarks	否	string	备注信息
 */
export function stockCheckSubmit(data) {
    return request({
        url: '/stock/pandian/pd_submit',
        method: 'post',
        data: data
    })
}

/** 确认
 参数名	必选	类型	说明
 id	是	int	盘点单id
 remarks	否	string	备注信息
 */
export function stockCheckConfirm(data) {
    return request({
        url: '/stock/pandian/pd_affirm',
        method: 'post',
        data: data
    })
}




