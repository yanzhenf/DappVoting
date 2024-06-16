# DappVoting - 去中心化投票系统

DappVoting 是一个基于以太坊区块链技术的去中心化投票系统，旨在提供安全、透明和可验证的选举过程。

## 系统工作流程

1. **管理员启动系统**：管理员在区块链网络（EVM）上部署系统，并创建选举实例，包括候选人列表。
2. **选民注册**：选民连接到区块链网络注册成为选民。注册信息显示在管理员面板上，管理员审核并批准有效的注册用户。
3. **选民投票**：获得管理员批准后，注册用户可以在投票页面上为心仪的候选人投票。
4. **结束选举**：管理员结束选举，投票关闭并在结果页面上宣布获胜者和显示投票结果。
5. **发起新选举**：管理员结束选举后可以发起新的选举。
6. **查看历史记录**：管理员可以查看历史选举记录。

## 设置开发环境

### 所需工具

- Node.js
- Truffle
- Ganache CLI
- Metamask 浏览器扩展程序

### 安装步骤

1. **安装 Node.js**：从 [Node.js 官网](https://nodejs.org/) 下载并安装 Node.js。
2. **安装 Truffle 和 Ganache CLI**：
    ```sh
    npm install -g truffle
    npm install -g ganache-cli
    ```
3. **安装 Metamask**：从 [Metamask 官网](https://metamask.io/) 下载并安装 Metamask 浏览器扩展程序。

### 项目配置

1. **克隆仓库**：
    ```sh
    git clone https://github.com/yanzhenf/DappVoting.git
    cd DappVoting
    ```
2. **运行本地以太坊区块链**：
    - 使用 Ganache CLI 启动本地以太坊区块链：
        ```sh
        ganache-cli
        ```
    - 或者启动 Ganache 客户端，或运行 Geth 来运行本地私有链。
3. **配置 Metamask**：在浏览器中配置 Metamask 扩展程序，使用以下详细信息：
    - 新的 RPC URL：http://127.0.0.1:8545（Geth 地址）
    - RPC URL：http://127.0.0.1:7545（Ganache 地址）
    - 链 ID：1337

    使用 Ganache 或 Geth 的私钥导入账户到 Metamask 扩展程序。
4. **部署智能合约**：在 DappVoting 目录中使用 Truffle 部署智能合约：
    ```sh
    truffle migrate
    ```
5. **启动开发服务器**：进入 client 目录，安装依赖并启动开发服务器：
    ```sh
    cd client
    npm install
    npm start
    ```

## 注意事项

- 在使用 `truffle migrate` 部署智能合约时，请确保 Ganache CLI 正在运行。
- 如果需要重新部署，可以使用 `truffle migrate --reset` 命令。
- 如果在 `npm install` 过程中遇到错误，请安装 Microsoft Visual C++ Redistributable packages。您可以从 [Microsoft 官网](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads) 下载并安装。

## 参考环境版本

- Truffle：v5.11.5
- Ganache：v2.7.1
- Node：v20.14.0
- Windows 11

---

本项目由逢考必过小组开发 ❤️❤️❤️
