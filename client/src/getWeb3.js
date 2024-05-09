import Web3 from "web3";

// 定义一个函数，用于获取 Web3 实例
const getWeb3 = () =>
    new Promise((resolve, reject) => {
      // 监听页面加载完成事件
      window.addEventListener("load", async () => {
        // 如果浏览器支持以太坊的以太币钱包 MetaMask
        if (window.ethereum) {
          // 创建一个 Web3 实例，使用 MetaMask 提供的 ethereum 对象
          const web3 = new Web3(window.ethereum);
          try {
            // 请求用户授权连接到以太坊网络
            await window.ethereum.enable();
            // 授权成功，解析返回的 Web3 实例
            resolve(web3);
          } catch (error) {
            // 如果用户拒绝了授权请求，则返回错误
            reject(error);
          }
        }
        // 如果浏览器中已经注入了旧版的 web3 对象
        else if (window.web3) {
          // 使用已注入的 web3 对象
          const web3 = window.web3;
          console.log("Injected web3 detected."); // 输出日志
          resolve(web3);
        }
        // 如果没有检测到 MetaMask 或旧版 web3 对象，则连接到本地以太坊节点
        else {
          // 创建一个 HTTP Provider 对象，连接到本地以太坊节点
          const provider = new Web3.providers.HttpProvider(
              "http://127.0.0.1:8545"
          );
          // 创建一个 Web3 实例，使用本地节点提供的 provider
          const web3 = new Web3(provider);
          console.log("No web3 instance injected, using Local web3."); // 输出日志
          resolve(web3);
        }
      });
    });

// 导出获取 Web3 实例的函数
export default getWeb3;
