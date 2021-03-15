import request from '@/utils/request'
/*
    获取系统所有菜单
*/
export function menuRouteAll(data) {
  return request({
      url: '/admin/Menu/all_get_menu',
      method: 'post',
      data: data
  })
}
/*
    菜单新增
    参数名	必选	类型	说明
    title	是	string	菜单名称
    pid	是	int	上级菜单id（顶级默认0）
    sort	是	string	排序，越大越靠前
    affix	是	string	图钉（0/false 1/true）
    keepAlive	是	string	是否开启缓存（0/false 1/true）
    isHidden	是	string	前端判断导航是否显示（0/false 1/true）
    icon	是	string	图标
    name	是	string	前端页面字段（唯一性）
*/
export function add(data) {
    return request({
        url: '/admin/Menu/add_menu',
        method: 'post',
        data: data
    })
}

/*
    菜单编辑
    参数名	必选	类型	说明
    id	是	int	菜单id
    title	是	string	菜单名称
    pid	是	int	上级菜单id（顶级默认0）
    sort	是	string	排序，越大越靠前
    affix	是	string	图钉（0/false 1/true）
    keepAlive	是	string	是否开启缓存（0/false 1/true）
    isHidden	是	string	前端判断导航是否显示（0/false 1/true）
    icon	是	string	图标
    name	是	string	前端页面字段（唯一性）
*/
export function edit(data) {
    return request({
        url: '/admin/Menu/up_menu',
        method: 'post',
        data: data
    })
}

/*
    菜单编辑
    参数名	必选	类型	说明
    id	是	int	菜单id
*/
export function setStatus(id) {
    return request({
        url: '/admin/Menu/status_menu',
        method: 'post',
        data: {id}
    })
}

/*
    获取按钮列表
*/
export function btnAll(data) {
    return request({
        url: '/admin/Button/bu_list',
        method: 'post',
        data: data
    })
}

/*
    按钮新增
    参数名	必选	类型	说明
    name	是	string	菜单唯一性标识
    title	是	string	按钮名称
    sort	是	string	排序
    colour	是	string	按钮颜色
    event	是	string	事件
*/
export function add_btn(data) {
    return request({
        url: '/admin/Button/bu_add',
        method: 'post',
        data: data
    })
}

/*
    按钮新增
    参数名	必选	类型	说明
    id	    是	int	按钮id
    name	是	string	菜单唯一性标识
    title	是	string	按钮名称
    sort	是	string	排序
    colour	是	string	按钮颜色
    event	是	string	事件
*/
export function edit_btn(data) {
    return request({
        url: '/admin/Button/bu_update',
        method: 'post',
        data: data
    })
}

/*
    按钮设置显示与隐藏
    参数名	必选	类型	说明
      id	是	int	按钮id
*/
export function setBtnStatus(id) {
    return request({
        url: '/admin/Button/bu_status',
        method: 'post',
        data: {id}
    })
}

/*
    管理组列表
    参数名	必选	类型	说明
      id	是	int	按钮id
*/
export function manageGroupList(data) {
    return request({
        url: '/admin/group/group_list',
        method: 'post',
        data: data
    })
}

/*
    管理组新增
    参数名	必选	类型	说明
    groupName	是	string	管理组名称
    status	是	string	状态（1启用2禁止）
*/
export function addManageGroup(data) {
    return request({
        url: '/admin/group/group_add',
        method: 'post',
        data: data
    })
}

/*
    管理组编辑
    参数名	必选	类型	说明
    groupName	是	string	管理组名称
    status	是	string	状态（1启用2禁止）
*/
export function editManageGroup(data) {
    return request({
        url: '/admin/group/group_add',
        method: 'post',
        data: data
    })
}

/*
    添加/修改管理组权限
    参数名	必选	类型	说明
    id	是	int	管理组id
    erp_function_id	是	string	菜单id列表 格式 1,2,3
    erp_anniu_id	是	string	按钮id列表 格式 1,2,3
*/
export function changeManageGroupRole(data) {
    return request({
        url: '/admin/group/add_auth',
        method: 'post',
        data: data
    })
}

/*
 高级搜索列表
参数名	必选	类型	说明
menu_name	是	string	菜单唯一标识
*/
export function searchList(data) {
    return request({
        url: '/admin/Search/s_list',
        method: 'post',
        data: data
    })
}


/*
 获取可搜索时数据合集
参数名	必选	类型	说明
search_type_id	是	int	数据类型id
data	否	string	搜索关键词
*/
export function searchAllData(data) {
    return request({
        url: '/admin/Search/search_type_data',
        method: 'post',
        data: data
    })
}

/*
 高级搜索--->新增
参数名	必选	类型	说明
menu_name	是	string	菜单唯一标识
db_name	是	string	数据表字段名
db_table	是	string	数据库名
search_name	是	string	搜索名称
is_search	是	int	是否可搜索1是，2否
search_way	是	string	搜索方式（搜索方式（1精确搜索，2范围搜索，3,时间范围搜索，4模糊搜索，5order分组）
frame_type	是	string	搜索框类型（input 输入框，date时间选择器，select 选择器）前端使用
search_type_id	否	string	数据类型来源id（当is_search 为1时必传）
json_date	否	json	json数据，格式[{“id”:1,”name”:”录入”}，{“id”:2,”name”:”提交”}] （当is_search为2且frame_type 为select 时必传）
*/
export function add_search(data) {
    return request({
        url: '/admin/Search/s_add',
        method: 'post',
        data: data
    })
}

/*
 高级搜索--->编辑
参数名	必选	类型	说明
id	        是	int	搜索id
menu_name	是	string	菜单唯一标识
db_name	是	string	数据表字段名
db_table	是	string	数据库名
search_name	是	string	搜索名称
is_search	是	int	是否可搜索1是，2否
search_way	是	string	搜索方式（搜索方式（1精确搜索，2范围搜索，3,时间范围搜索，4模糊搜索，5order分组）
frame_type	是	string	搜索框类型（input 输入框，date时间选择器，select 选择器）前端使用
search_type_id	否	string	数据类型来源id（当is_search 为1时必传）
json_date	否	json	json数据，格式[{“id”:1,”name”:”录入”}，{“id”:2,”name”:”提交”}] （当is_search为2且frame_type 为select 时必传）
*/
export function edit_search(data) {
    return request({
        url: '/admin/Search/s_update',
        method: 'post',
        data: data
    })
}

/*
    高级搜索修改状态
    参数名	必选	类型	说明
      id	是	int	搜索id
*/
export function setSearchStatus(data) {
    return request({
        url: '/admin/Search/s_status',
        method: 'post',
        data: data
    })
}

/*
   根据菜单唯一标识获得搜索详情
参数名	必选	类型	说明
menu_name	是	string	菜单唯一标识
*/
export function searchDetails(data) {
    return request({
        url: '/admin/Search/search_view',
        method: 'post',
        data: data
    })
}


/*
    数据类型列表
*/
export function searchTypeList(data) {
    return request({
        url: '/admin/Search/search_type_list',
        method: 'post',
        data: data
    })
}

/*
    可搜索是数据列表
参数名	必选	类型	说明
search_type_id	是	int	数据类型id
data	否	string	搜索关键词
*/
export function searchframe(data) {
    return request({
        url: '/admin/Search/search_type_data',
        method: 'post',
        data: data
    })
}




