import request from '@/utils/request'
/** 列表
    参数名	必选	类型	说明
    dbname	否	string	排序字段 默认：create_time
    paixu	否	string	排序顺序 默认：desc
    limit	否	int	条数 默认：15
    page	否	int	页码
 */
export function ke_list(data) {
    return request({
        url: '/admin/Problem/ke_list',
        method: 'post',
        data: data
    })
}

/** 新增
    参数名	必选	类型	说明
    order_code	是	string	销售单号
    product_id	是	int	商品id
    attr_val_ids	是	array	商品规格 格式[“1,2”,”2,3”]
    produce_date	是	string	生产日期 格式2021-11-18
    remarks_img	否	string	上传照片
    remarks	是	string	备注信息
 */
export function add(data) {
  return request({
      url: '/admin/Problem/ke_add',
      method: 'post',
      data: data
  })
}

/** 编辑
    参数名	必选	类型	说明
    id	是	int	记录id
    order_code	是	string	销售单号
    product_id	是	int	商品id
    attr_val_ids	是	array	商品规格 格式[“1,2”,”2,3”]
    produce_date	是	string	生产日期 格式2021-11-18
    remarks_img	否	string	上传照片
    remarks	是	string	备注信息
 */
export function edit(data) {
  return request({
      url: '/admin/Problem/ke_up',
      method: 'post',
      data: data
  })
}

/** 删除
    参数名	必选	类型	说明
    id	是	int	记录id
 */
export function del(data) {
  return request({
      url: '/admin/Problem/ke_del',
      method: 'post',
      data: data
  })
}

/** 根据订单编号获取商品信息
    参数名	必选	类型	说明
    order_code	是	string	订单编号
 */
export function ke_get_product(data) {
  return request({
      url: '/admin/Problem/ke_get_product',
      method: 'post',
      data: data
  })
}
