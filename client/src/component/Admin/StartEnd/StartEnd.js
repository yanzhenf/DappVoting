import React, {Component} from "react";
import Navbar from "../../Navbar/Navigation"; // 导入普通用户导航栏组件
import NavbarAdmin from "../../Navbar/NavigationAdmin"; // 导入管理员导航栏组件
import AdminOnly from "../../AdminOnly"; // 导入管理员权限组件
import getWeb3 from "../../../getWeb3"; // 导入获取 Web3 实例的函数
import Election from "../../../contracts/Election.json"; // 导入选举合约 ABI
import "./StartEnd.css";

// 类组件 StartEnd
export default class StartEnd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined, // 选举合约实例
            web3: null, // Web3 实例
            accounts: null, // 用户账户
            isAdmin: false, // 是否是管理员
            elStarted: false, // 是否已开始选举
            elEnded: false, // 是否已结束选举
        };
    }

    // 组件挂载后调用
    componentDidMount = async () => {
        // 刷新页面只执行一次
        if (!window.location.hash) {
            window.location = window.location + "#loaded";
            window.location.reload();
        }

        try {
            // 获取 Web3 实例
            const web3 = await getWeb3();

            // 使用 Web3 获取用户账户
            const accounts = await web3.eth.getAccounts();

            // 获取选举合约实例
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Election.networks[networkId];
            const instance = new web3.eth.Contract(
                Election.abi,
                deployedNetwork && deployedNetwork.address
            );

            // 将 Web3、账户和合约实例设置到状态中
            this.setState({
                web3: web3,
                ElectionInstance: instance,
                account: accounts[0],
            });

            // 获取管理员信息
            const admin = await this.state.ElectionInstance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({isAdmin: true});
            }

            // 获取选举开始和结束状态
            const start = await this.state.ElectionInstance.methods.getStart().call();
            this.setState({elStarted: start});
            const end = await this.state.ElectionInstance.methods.getEnd().call();
            this.setState({elEnded: end});
        } catch (error) {
            // 捕获任何错误
            alert(
                `无法加载Web3、账户或合约。请检查控制台以获取详细信息。`
            );
            console.error(error);
        }
    };

    // 开始选举
    startElection = async () => {
        await this.state.ElectionInstance.methods
            .startElection()
            .send({from: this.state.account, gas: 1000000});
        window.location.reload();
    };

    // 结束选举
    endElection = async () => {
        await this.state.ElectionInstance.methods
            .endElection()
            .send({from: this.state.account, gas: 1000000});
        window.location.reload();
    };

    // 渲染组件
    render() {
        // 如果没有获取到 Web3 实例，显示加载信息
        if (!this.state.web3) {
            return (
                <>
                    {this.state.isAdmin ? <NavbarAdmin/> : <Navbar/>}
                    <center>加载Web3、账户和合约中...</center>
                </>
            );
        }
        // 如果当前用户不是管理员，显示权限不足页面
        if (!this.state.isAdmin) {
            return (
                <>
                    <Navbar/>
                    <AdminOnly page="开始和结束选举页面"/>
                </>
            );
        }
        return (
            <>
                <NavbarAdmin/>
                {!this.state.elStarted & !this.state.elEnded ? (
                    <div className="container-item info">
                        <center>选举尚未启动。</center>
                    </div>
                ) : null}
                <div className="container-main">
                    <h3>开始或结束选举</h3>
                    {!this.state.elStarted ? (
                        <>
                            <div className="container-item">
                                <button onClick={this.startElection} className="start-btn">
                                    开始选举
                                    {this.state.elEnded ? "（重新开始）" : null}
                                </button>
                            </div>
                            {this.state.elEnded ? (
                                <div className="container-item">
                                    <center>
                                        <p>选举已结束。</p>
                                    </center>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <div className="container-item">
                                <center>
                                    <p>选举已开始。</p>
                                </center>
                            </div>
                            <div className="container-item">
                                <button onClick={this.endElection} className="start-btn">
                                    结束选举
                                </button>
                            </div>
                        </>
                    )}
                    <div className="election-status">
                        <p>已开始：{this.state.elStarted ? "是" : "否"}</p>
                        <p>已结束：{this.state.elEnded ? "是" : "否"}</p>
                    </div>
                </div>
            </>
        );
    }
}
