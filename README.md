 DappVoting - 去中心化投票系统
DappVoting 是基于以太坊区块链技术的去中心化投票系统，旨在提供安全、透明和可验证的选举过程。以下是系统的工作流程和设置开发环境的详细说明。

系统工作流程
管理员启动系统：管理员在区块链网络（EVM）上启动/部署系统，并创建选举实例，包括选民投票的候选人。

选民注册：可能的选民连接到同一区块链网络以注册成为选民。注册信息将显示在管理员面板上，管理员审核并批准有效的注册用户。

选民投票：获得管理员批准后，注册用户可以在投票页面上投票给感兴趣的候选人。

结束选举：管理员结束选举，投票关闭并在结果页面上宣布获胜者，并显示结果。


设置开发环境
要求安装以下工具：
Node.js
Truffle
Ganache CLI
Metamask 浏览器扩展程序
获取要求
安装 Node.js：从 Node.js 官网 下载并安装 Node.js。

安装 Truffle 和 Ganache CLI：使用 npm 全局安装 Truffle 和 Ganache CLI：

npm install -g truffle

npm install -g ganache-cli

安装 Metamask：从 Metamask 官网 下载并安装 Metamask 浏览器扩展程序。

配置项目以进行开发
克隆仓库：使用以下命令克隆此仓库：

git clone https://github.com/yanzhenf/DappVoting.git

cd dVoting

运行本地以太坊区块链：使用 Ganache CLI 启动本地以太坊区块链：
ganache-cli
配置 Metamask：在浏览器中配置 Metamask 扩展程序，使用以下详细信息：

新的 RPC URL：http://127.0.0.1:8545（Geth地址）

    RPC URL：http://127.0.0.1:7545（Ganache地址）
    
链ID：1337

使用 Ganache或者Geth的私钥导入账户到 Metamask 扩展程序。

部署智能合约：在 dVoting 目录中使用 Truffle 部署智能合约：

truffle migrate

启动开发服务器：进入 client 目录，安装依赖并启动开发服务器：

cd client

npm install

npm start

注意事项
在使用 truffle migrate 部署智能合约时，请确保 Ganache CLI 正在运行。
如果需要重新部署，可以使用  truffle migrate --reset命令。
如果在 npm install 过程中遇到错误，请安装 Microsoft Visual C++ Redistributable packages。
您可以从 Microsoft 官网 下载安装。
通过以上说明，您可以在本地设置和运行 dVoting 去中心化投票系统的开发环境，并开始进行开发和测试。
