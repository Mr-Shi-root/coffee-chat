# Coffee Chat 架构设计文档

## 一、技术选型思路

### 为什么选择这套技术栈？

| 层级 | 技术 | 选择理由 |
|------|------|----------|
| **前端框架** | Taro + React | 跨端能力强，一套代码可编译到微信/支付宝/H5 |
| **后端框架** | Koa | 轻量、洋葱模型中间件、你已熟悉 |
| **数据库** | MongoDB | 文档型数据库，Schema 灵活，适合快速迭代 |
| **语言** | TypeScript (前端) / JavaScript (后端) | 前端类型安全，后端快速开发 |

---

## 二、项目结构设计

```
coffee-chat/
├── client/                     # 前端 - Taro 小程序
│   ├── config/                 # Taro 构建配置
│   │   ├── index.ts           # 主配置（alias、编译选项）
│   │   ├── dev.ts             # 开发环境配置
│   │   └── prod.ts            # 生产环境配置
│   │
│   ├── src/
│   │   ├── app.ts             # 应用入口
│   │   ├── app.config.ts      # 小程序全局配置（页面路由、窗口样式）
│   │   ├── app.scss           # 全局样式
│   │   │
│   │   ├── pages/             # 页面目录
│   │   │   └── index/         # 首页
│   │   │       ├── index.tsx          # 页面组件
│   │   │       ├── index.scss         # 页面样式
│   │   │       └── index.config.ts    # 页面配置
│   │   │
│   │   ├── services/          # API 服务层
│   │   │   ├── request.ts     # 请求封装（拦截器、token 处理）
│   │   │   └── api.ts         # 具体 API 接口
│   │   │
│   │   ├── utils/             # 工具函数
│   │   └── assets/            # 静态资源
│   │
│   ├── types/                  # TypeScript 类型声明
│   ├── project.config.json     # 微信小程序项目配置
│   └── tsconfig.json           # TypeScript 配置
│
├── server/                     # 后端 - Koa 服务
│   ├── src/
│   │   ├── app.js             # 应用入口（中间件注册、启动）
│   │   │
│   │   ├── config/            # 配置层
│   │   │   ├── index.js       # 环境变量读取
│   │   │   └── db.js          # 数据库连接
│   │   │
│   │   ├── routes/            # 路由层
│   │   │   ├── index.js       # 路由汇总
│   │   │   └── user.js        # 用户相关路由
│   │   │
│   │   ├── controllers/       # 控制器层（业务逻辑）
│   │   │   └── userController.js
│   │   │
│   │   ├── models/            # 数据模型层
│   │   │   └── User.js        # 用户模型
│   │   │
│   │   ├── middlewares/       # 中间件
│   │   │   ├── auth.js        # JWT 认证
│   │   │   └── errorHandler.js # 错误处理
│   │   │
│   │   └── utils/             # 工具函数
│   │       ├── response.js    # 统一响应格式
│   │       └── wxAuth.js      # 微信登录工具
│   │
│   ├── .env                    # 环境变量（不提交 Git）
│   └── .env.example            # 环境变量模板
│
└── README.md                   # 项目说明
```

---

## 三、架构分层设计

### 前端架构（Taro）

```
┌─────────────────────────────────────────┐
│                 Pages                    │  ← 页面组件，处理 UI 和用户交互
├─────────────────────────────────────────┤
│               Services                   │  ← API 调用层，封装请求逻辑
├─────────────────────────────────────────┤
│                Request                   │  ← 请求工具，处理 token、错误
├─────────────────────────────────────────┤
│              Taro API                    │  ← 小程序原生能力
└─────────────────────────────────────────┘
```

**设计要点**：
1. **request.ts** - 统一封装 Taro.request，自动注入 token，处理 401
2. **api.ts** - 按模块组织 API，方便维护
3. **Pages** - 每个页面独立目录，包含组件、样式、配置

### 后端架构（Koa）

```
┌─────────────────────────────────────────┐
│              Middlewares                 │  ← 中间件：CORS、BodyParser、错误处理
├─────────────────────────────────────────┤
│                Routes                    │  ← 路由：定义 API 路径
├─────────────────────────────────────────┤
│              Controllers                 │  ← 控制器：业务逻辑
├─────────────────────────────────────────┤
│                Models                    │  ← 数据模型：MongoDB Schema
├─────────────────────────────────────────┤
│               MongoDB                    │  ← 数据存储
└─────────────────────────────────────────┘
```

**设计要点**：
1. **洋葱模型** - 请求从外到内，响应从内到外
2. **职责分离** - Route 只做路由映射，Controller 处理业务，Model 定义数据
3. **统一响应** - 所有 API 返回 `{ code, message, data }` 格式

---

## 四、搭建过程详解

### Step 1: 创建目录结构

```bash
mkdir -p server/{src/{controllers,models,routes,middlewares,utils,config},logs}
mkdir -p client/src/{pages/index,services,utils,assets}
```

**思路**：先规划好目录，职责清晰，后续开发不混乱。

### Step 2: 搭建后端 Koa 服务

**顺序**：配置 → 数据库 → 模型 → 路由 → 控制器 → 中间件 → 入口

```
1. config/index.js     ← 读取环境变量
2. config/db.js        ← MongoDB 连接
3. models/User.js      ← 定义用户模型
4. utils/response.js   ← 统一响应格式
5. utils/wxAuth.js     ← 微信登录工具
6. middlewares/auth.js ← JWT 认证中间件
7. middlewares/errorHandler.js ← 错误处理
8. controllers/userController.js ← 用户业务逻辑
9. routes/user.js      ← 用户路由
10. routes/index.js    ← 路由汇总
11. app.js             ← 应用入口，组装所有模块
```

### Step 3: 搭建前端 Taro 项目

**顺序**：配置 → 入口 → 请求封装 → 页面

```
1. config/index.ts     ← Taro 构建配置（alias 等）
2. tsconfig.json       ← TypeScript 配置
3. app.ts + app.config.ts ← 应用入口
4. services/request.ts ← 请求封装
5. services/api.ts     ← API 接口
6. pages/index/        ← 首页
```

### Step 4: 连接前后端

```
前端                          后端
┌──────────┐                 ┌──────────┐
│  Button  │ ─── 点击 ───→   │          │
│  Login   │                 │  /api/   │
│          │ ← Taro.login    │  user/   │
│          │    获取 code    │  login   │
│          │ ─── POST ───→   │          │
│          │    { code }     │          │
│          │                 │    ↓     │
│          │                 │ 调用微信  │
│          │                 │ jscode2  │
│          │                 │ session  │
│          │                 │    ↓     │
│          │                 │ 获取     │
│          │                 │ openid   │
│          │                 │    ↓     │
│          │                 │ 创建/    │
│          │                 │ 查找用户  │
│          │                 │    ↓     │
│          │ ← 返回 token    │ 生成 JWT │
│  存储    │                 │          │
│  token   │                 │          │
└──────────┘                 └──────────┘
```

---

## 五、关键设计决策

### 1. 为什么用 JWT 而不是 Session？

| 方案 | 优点 | 缺点 |
|------|------|------|
| Session | 服务端可控，可主动失效 | 需要存储，分布式复杂 |
| **JWT** | 无状态，扩展性好 | 无法主动失效 |

小程序场景下 JWT 更合适，服务端无状态，方便部署。

### 2. 为什么前端用 TypeScript，后端用 JavaScript？

- **前端 TS**：组件 props、API 响应类型检查，减少运行时错误
- **后端 JS**：快速开发，Mongoose 本身提供 Schema 验证

后端后续可迁移到 TS，当前阶段优先速度。

### 3. 统一响应格式

```javascript
// 成功
{ code: 0, message: 'Success', data: {...} }

// 失败
{ code: -1, message: 'Error message', data: null }

// 未认证
{ code: 401, message: 'Unauthorized', data: null }
```

前端只需判断 `code === 0` 即可知道是否成功。

---

## 六、扩展方向

当前是基础框架，后续可扩展：

```
coffee-chat/
├── client/
│   ├── src/
│   │   ├── components/        # 公共组件
│   │   ├── store/             # 状态管理（Zustand/Redux）
│   │   ├── hooks/             # 自定义 Hooks
│   │   └── pages/
│   │       ├── chat/          # 聊天页
│   │       ├── profile/       # 个人中心
│   │       └── match/         # 匹配页
│
└── server/
    └── src/
        ├── models/
        │   ├── Chat.js        # 聊天记录
        │   └── Match.js       # 匹配记录
        ├── routes/
        │   ├── chat.js        # 聊天接口
        │   └── match.js       # 匹配接口
        └── services/          # 业务服务层（复杂逻辑抽离）
```

---

## 七、总结

整体搭建思路：

1. **技术选型** → 根据需求和个人技能选择
2. **目录规划** → 先设计结构，职责分明
3. **自底向上** → 先基础设施（配置、数据库），再业务逻辑
4. **分层解耦** → 每层只关心自己的职责
5. **统一规范** → 响应格式、错误处理、命名规范

这套架构简单但完整，适合小程序快速开发，也方便后续扩展。
