<<<<<<< HEAD
# Coffee Chat

一个基于 Taro + Koa + MongoDB 的小程序项目。

## 项目结构

```
coffee-chat/
├── client/                 # Taro 小程序前端
│   ├── src/
│   │   ├── pages/         # 页面
│   │   ├── services/      # API 服务
│   │   └── utils/         # 工具函数
│   └── config/            # Taro 配置
│
└── server/                 # Koa 后端服务
    └── src/
        ├── config/        # 配置文件
        ├── controllers/   # 控制器
        ├── middlewares/   # 中间件
        ├── models/        # 数据模型
        ├── routes/        # 路由
        └── utils/         # 工具函数
```

## 技术栈

- **前端**: Taro 3.x + React 18 + TypeScript
- **后端**: Koa 2.x + Node.js
- **数据库**: MongoDB + Mongoose

## 快速开始

### 环境要求

- Node.js >= 16
- MongoDB >= 4.4
- 微信开发者工具

### 后端启动

```bash
cd server
cp .env.example .env  # 配置环境变量
npm install
npm run dev
```

### 前端启动

```bash
cd client
npm install
npm run dev:weapp  # 微信小程序
```

然后用微信开发者工具打开 `client/dist/weapp` 目录。

## API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/user/login` | POST | 微信登录 |
| `/api/user/info` | GET | 获取用户信息 |
| `/api/user/info` | PUT | 更新用户信息 |

## 配置说明

### 后端 (.env)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coffee_chat
JWT_SECRET=your_secret
WX_APP_ID=your_app_id
WX_APP_SECRET=your_app_secret
```

### 前端

修改 `client/src/services/request.ts` 中的 `BASE_URL` 为你的服务器地址。
=======
# coffee-chat
# coffee-chat
>>>>>>> 1da9ca450bbdb98f66d1d55b99fe8871d3cf47ba
