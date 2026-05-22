# CoffeeAgent | 个人隐私级本地商业大脑

<p align="center"><img src="./icon.jpg" width="180" alt="CoffeeAgent" style="border-radius: 20px;"/></p>

---

## 项目定位

CoffeeAgent 是一个以隐私为核心的本地化 AI 基建。

不联网，数据不出库，双击即用的原生商业效率工具。

**官方主页：** https://hub.coffeenotehq.com/

---

## 快速起步与协作

如果你希望参与 CoffeeAgent 的搭建或自行部署，请遵循以下流程。如果你是开发者，欢迎提交 PR 完善此路径。

### 安装指南

**第一步：克隆代码库**
```bash
git clone https://github.com/coffee-notes/CoffeeAgent.git
```

**第二步：环境要求**
确保安装 Node.js 与 Tauri 环境依赖。

**第三步：安装依赖**
```bash
npm install
```

**第四步：本地构建**
```bash
npm run tauri build
```

**第五步：获取应用**
在 `src-tauri/target/release/bundle/macos/` 下找到你的 CoffeeAgent.app。

### 协作建议

如果你在安装过程中遇到权限拦截（macOS Gatekeeper），请运行以下命令解除系统限制：
```bash
xattr -cr [你的App路径]
```

---

## 商业审计与服务

CoffeeAgent 是我进行商业架构审计的核心引擎。

如果你是企业主或业务负责人，希望将这种高效的本地流引入你的团队但不想触碰代码：

- 请点击 [预约架构师私有化审计](https://hub.coffeenotehq.com/)
- 我提供 21 天落地护航服务，直接帮你完成业务逻辑映射与系统基建搭建

---

## 协作协议

保持开放，但严禁将此开源架构用于未经授权的商业复制。
