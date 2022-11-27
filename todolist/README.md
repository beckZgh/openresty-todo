# OpenResty ToDo

一款参考 Micrtosoft ToDo 风格的在线待办任务管理系统

## 项目介绍

练习后端开发的产物

## 项目特色

- 支持登录、注册
- 支持浅色、深色主题
- 支持任务列表
- 支持任务列表进行分组
- 支持 “我的一天”、“重要”、“计划内”、“已完成”、“全部”、“任务” 六个智能列表
- 支持不同列表设置不同浅、深色主题
- 采用 [element-plus](https://element-plus.gitee.io/zh-CN/) UI库
- 前端使用 [Vue3](https://cn.vuejs.org/) + [Typescript](https://www.typescriptlang.org/) + [Vite](https://cn.vitejs.dev/) 最新技术栈构建
- 后端使用我司开源的 [OpenResty-appx](https://github.com/killsen/openresty-appx) 开发

## 正在开发中

- 支持 Gitee 登录
- 支持 Gitee Issuce 列表协同办公
- 支持 我的一天 切换 四象限视图
- 支持 我的日历 上帝视角查看任务

## 项目开发

- 前端开发

    进入到 `todolist` 目录

```sh
// 开发模式
pnpm dev

// 打包模式
pnpm build
```

- 后端开发

    进入到 `server` 目录

```sh
// 启动服务
orpm start

// 停用服务
orpm stop
```
