去中心化投票（dVoting） 基于以太坊区块链技术的去中心化投票系统。

系统工作流程 关于应用程序基本工作流程的简要说明。

管理员将通过在区块链网络（EVM）上启动/部署系统来创建投票实例，然后创建选举实例并使用填写的选举详情（包括选民投票的候选人）开始选举。

然后，可能的选民连接到同一区块链网络以注册成为选民。一旦用户成功注册，他们的相关详细信息将被发送/显示在管理员面板上（即验证页面）。

然后，管理员将检查注册信息（区块链账户地址、姓名和电话号码）是否有效并与其记录匹配。如果是，则管理员批准注册用户，使他们有资格参与选举并投票给感兴趣的候选人。

获得管理员批准后，注册用户（选民）可以在投票页面上投票给感兴趣的候选人。

一段时间后，根据选举的规模，管理员结束选举。随着选举的结束，投票关闭并在结果页面的顶部宣布获胜者，显示结果。

点击这里查看演示。

设置开发环境 要求 Node.js ，Truffle Ganache（Cli）， Metamask（浏览器扩展程序） 

获取要求 下载并安装NodeJS

从这里下载并安装NodeJS。

使用Node包管理器（npm）安装truffle和ganache-cli

npm install -g truffle

 npm install -g ganache-cli 

安装metamask浏览器扩展程序

从这里下载并安装metamask。

配置项目以进行开发 克隆这个仓库

git clone https://github.com/yanzhenf/DappVoting.git

cd dVoting

运行本地以太坊区块链

ganache-cli 注意：不要关闭ganache-cli（区块链网络需要一直运行）

在浏览器上使用以下详细信息配置metamask

新的RPC URL：http://127.0.0.1:8545（在ganache gui中使用端口：7545，也需要在文件：truffle-config.js中更新）

链ID：1337

使用ganache-cli的私钥导入账户到浏览器上的metamask扩展程序

将智能合约部署到（本地）区块链网络（即ganache-cli）

＃在dVoting目录上 truffle migrate 注意：对于重新部署，请使用truffle migrate --reset

启动开发服务器（前端）

cd client
npm install
npm start 
如果在npm install期间遇到错误，请注意您可能需要从learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist（这是X64的直接下载链接：aka.ms/vs/17/release/vc_redist.x64.exe）安装Microsoft Visual C++ Redistributable packages。

