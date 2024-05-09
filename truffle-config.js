const path = require("path");

module.exports = {
    // 查看 <http://truffleframework.com/docs/advanced/configuration>
    // 自定义Truffle配置!
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
        development: {
            network_id: "*",
            host: "127.0.0.1",
            port: 7545, //  ganache 端口
            //port: 8545, // geth端口
            gas: 6721975,
            gasPrice: 20000000000,
        },
    },
};
