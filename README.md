# website

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

# 开发的后台管理系统框架
> 基于vue3x 使用到vuex,router，等
>
```
- src
    -- api/  接口存放
    -- assets/ 媒体素材存放
        --- css/ 公共样式库
            ---- index.scss 公共样式入口
        --- layout/ 框架样式 
    -- components/ 组件存放
        --- filters/ filters函数存放
    -- layout/ oa框架存放
        --- leftNav 左边导航栏
        --- index.vue 框架主体
    -- router/ 路由处理存放
    -- store/ vuex存放
    -- utils/ js存放
       --- request.js 路由拦截
    -- views/ 页面存放 
        --- assembly/ 页面大模块组件存放位置
        --- page/ 网站页面主体存放位置
    -- App.vue 页面进入口
    -- main.js
- public 
- vue.config.js 主体vue配置 
```