# 线上部署指南

## 一、服务器环境准备（宝塔面板）

### 1. 安装必要软件

在宝塔面板「软件商店」中安装：

- **PM2管理器**（用于运行 Node.js）
- **MongoDB**（数据库）
- **Nginx**（反向代理）

### 2. 安装 Node.js

在宝塔面板：
1. 软件商店 → 搜索 "Node.js版本管理器" → 安装
2. 安装 Node.js 18.x 版本

或者 SSH 登录服务器手动安装：
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 安装 Node.js 18
nvm install 18
nvm use 18
```

### 3. 启动 MongoDB

在宝塔面板：
1. 软件商店 → 找到已安装的 MongoDB → 启动
2. 默认端口 27017，无密码（建议生产环境设置密码）

---

## 二、上传代码到服务器

### 方式一：Git 拉取（推荐）

```bash
# SSH 登录服务器
cd /www/wwwroot
git clone https://github.com/你的用户名/coffee-chat.git
cd coffee-chat/server
```

### 方式二：宝塔文件管理器上传

1. 在本地打包 server 文件夹（不含 node_modules）
2. 宝塔面板 → 文件 → 上传到 `/www/wwwroot/coffee-chat/server`

---

## 三、配置和启动后端

### 1. 安装依赖

```bash
cd /www/wwwroot/coffee-chat/server
npm install
```

### 2. 创建生产环境配置

```bash
cp .env.example .env
vi .env
```

修改 `.env` 文件：
```bash
# Server
PORT=3000
NODE_ENV=production

# MongoDB（如果 MongoDB 设置了密码）
MONGODB_URI=mongodb://用户名:密码@localhost:27017/coffee_chat

# 如果没有密码
MONGODB_URI=mongodb://localhost:27017/coffee_chat

# JWT（改成一个随机字符串！）
JWT_SECRET=your_random_secret_key_here_change_this
JWT_EXPIRES_IN=7d

# WeChat（填写真实的 AppID 和 Secret）
WX_APP_ID=你的小程序AppID
WX_APP_SECRET=你的小程序AppSecret
```

### 3. 使用 PM2 启动

```bash
# 安装 PM2（如果没有）
npm install -g pm2

# 启动服务
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs coffee-chat-server

# 设置开机自启
pm2 save
pm2 startup
```

### 4. 验证服务是否启动

```bash
curl http://localhost:3000/api/health
```

应返回：
```json
{"code":0,"message":"Server is running","data":{"timestamp":"..."}}
```

---

## 四、配置 Nginx 反向代理（需要域名和 HTTPS）

如果你有域名，在宝塔面板：

### 1. 添加站点
- 网站 → 添加站点
- 域名：`api.feeltalk.top`
- PHP版本：纯静态

### 2. 配置 SSL
- 点击站点 → SSL → Let's Encrypt → 申请免费证书

### 3. 配置反向代理
- 点击站点 → 反向代理 → 添加反向代理
- 代理名称：api
- 目标URL：`http://127.0.0.1:3000`

或者手动编辑 Nginx 配置：
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 五、前端打包和上传

### 1. 修改 API 地址

编辑 `client/src/services/request.ts`：
```typescript
// 开发环境
// const BASE_URL = 'http://localhost:3000/api'

// 生产环境（改成你的域名）
const BASE_URL = 'https://api.yourdomain.com/api'
```

### 2. 打包小程序

```bash
cd client
npm run build:weapp
```

打包后的文件在 `client/dist/weapp/` 目录。

### 3. 上传小程序

1. 打开微信开发者工具
2. 导入 `client` 目录
3. 点击右上角「上传」
4. 填写版本号和描述
5. 登录微信公众平台 → 版本管理 → 提交审核

---

## 六、微信公众平台配置

登录 [微信公众平台](https://mp.weixin.qq.com/)：

### 1. 配置服务器域名

开发管理 → 开发设置 → 服务器域名：

- request合法域名：`https://api.yourdomain.com`

### 2. 获取 AppID 和 AppSecret

开发管理 → 开发设置 → 开发者ID：

- 复制 AppID 和 AppSecret
- 填入服务器的 `.env` 文件

---

## 七、常用命令

```bash
# 查看 PM2 状态
pm2 status

# 重启服务
pm2 restart coffee-chat-server

# 查看日志
pm2 logs coffee-chat-server

# 停止服务
pm2 stop coffee-chat-server

# 查看 MongoDB 状态
systemctl status mongod
```

---

## 八、故障排查

### 1. 服务无法启动
```bash
# 查看详细日志
pm2 logs coffee-chat-server --lines 100
```

### 2. MongoDB 连接失败
```bash
# 检查 MongoDB 是否运行
systemctl status mongod

# 检查端口
netstat -tlnp | grep 27017
```

### 3. 小程序请求失败
- 检查域名是否配置正确
- 检查 SSL 证书是否有效
- 检查 Nginx 反向代理配置
