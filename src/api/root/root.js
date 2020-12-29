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
export function addBtn(data) {
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
export function editBtn(data) {
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
        url: 'admin/Button/bu_status',
        method: 'post',
        data: {id}
    })
}