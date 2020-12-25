import request from '@/utils/request'
/*
    登录
    account	是	string	员工账号
    password	是	string	密码
    captcha	否	string	验证码
*/
export function login(data) {
    return request({
        url: '/admin/login/login',
        method: 'post',
        data: data
    })
}
/*
    获取账号权限内菜单
*/
export function get_menu(data) {
    return request({
        url: '/admin/Menu/get_menu',
        method: 'post',
        data: data
    })
}