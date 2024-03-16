// Node模块
import React, {Component} from "react";

// 组件
import Navbar from "../Navbar/Navigation"; // 导航栏组件
import NavbarAdmin from "../Navbar/NavigationAdmin"; // 管理员导航栏组件
import NotInit from "../NotInit"; // 未初始化组件

// CSS
import "./Registration.css";

// 合约
import getWeb3 from "../../getWeb3"; // 获取Web3实例
import Election from "../../contracts/Election.json"; // 选举合约ABI

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined, // 选举合约实例
            web3: null, // Web3实例
            account: null, // 用户账户地址
            isAdmin: false, // 是否为管理员
            isElStarted: false, // 选举是否已开始
            isElEnded: false, // 选举是否已结束
            voterCount: undefined, // 投票者数量
            voterName: "", // 投票者姓名
            voterPhone: "", // 投票者电话号码
            voters: [], // 所有投票者列表
            currentVoter: { // 当前投票者信息
                address: undefined, // 地址
                name: null, // 姓名
                phone: null, // 电话号码
                hasVoted: false, // 是否已投票
                isVerified: false, // 是否已验证
                isRegistered: false, // 是否已注册
            },
        };
    }

    // 刷新页面仅执行一次
    componentDidMount = async () => {
        if (!window.location.hash) {
            window.location = window.location + "#loaded";
            window.location.reload();
        }
        try {
            // 获取网络提供程序和Web3实例
            const web3 = await getWeb3();

            // 使用Web3获取用户账户
            const accounts = await web3.eth.getAccounts();

            // 获取合约实例
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Election.networks[networkId];
            const instance = new web3.eth.Contract(
                Election.abi,
                deployedNetwork && deployedNetwork.address
            );

            // 将Web3、账户和合约设置为状态，并继续与合约方法交互的示例。
            this.setState({
                web3: web3,
                ElectionInstance: instance,
                account: accounts[0],
            });

            // 管理员账户和验证
            const admin = await this.state.ElectionInstance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({isAdmin: true});
            }

            // 获取开始和结束值
            const start = await this.state.ElectionInstance.methods.getStart().call();
            this.setState({isElStarted: start});
            const end = await this.state.ElectionInstance.methods.getEnd().call();
            this.setState({isElEnded: end});

            // 获取投票者总数
            const voterCount = await this.state.ElectionInstance.methods
                .getTotalVoter()
                .call();
            this.setState({voterCount: voterCount});

            // 加载所有投票者
            for (let i = 0; i < this.state.voterCount; i++) {
                const voterAddress = await this.state.ElectionInstance.methods
                    .voters(i)
                    .call();
                const voter = await this.state.ElectionInstance.methods
                    .voterDetails(voterAddress)
                    .call();
                this.state.voters.push({
                    address: voter.voterAddress,
                    name: voter.name,
                    phone: voter.phone,
                    hasVoted: voter.hasVoted,
                    isVerified: voter.isVerified,
                    isRegistered: voter.isRegistered,
                });
            }
            this.setState({voters: this.state.voters});

            // 加载当前投票者
            const voter = await this.state.ElectionInstance.methods
                .voterDetails(this.state.account)
                .call();
            this.setState({
                currentVoter: {
                    address: voter.voterAddress,
                    name: voter.name,
                    phone: voter.phone,
                    hasVoted: voter.hasVoted,
                    isVerified: voter.isVerified,
                    isRegistered: voter.isRegistered,
                },
            });
        } catch (error) {
            // 捕获以上操作的任何错误。
            console.error(error);
            alert(
                `加载Web3、账户或合约失败。请查看控制台以获取详细信息 (F12)。`
            );
        }
    };

    // 更新投票者姓名
    updateVoterName = (event) => {
        this.setState({voterName: event.target.value});
    };

    // 更新投票者电话号码
    updateVoterPhone = (event) => {
        this.setState({voterPhone: event.target.value});
    };

    // 注册为投票者
    registerAsVoter = async () => {
        await this.state.ElectionInstance.methods
            .registerAsVoter(this.state.voterName, this.state.voterPhone)
            .send({from: this.state.account, gas: 1000000});
        window.location.reload();
    };

    render() {
        if (!this.state.web3) {
            // 如果未加载Web3，则显示加载信息
            return (
                <>
                    {this.state.isAdmin ? <NavbarAdmin/> : <Navbar/>}
                    <center>加载Web3、账户和合约中...</center>
                </>
            );
        }
        return (
            <>
                {this.state.isAdmin ? <NavbarAdmin/> : <Navbar/>}
                {!this.state.isElStarted && !this.state.isElEnded ? (
                    // 如果选举未开始或未结束，则显示未初始化组件
                    <NotInit/>
                ) : (
                    <>
                        <div className="container-item info">
                            {/* 显示总注册选民数 */}
                            <p>总注册选民数: {this.state.voters.length}</p>
                        </div>
                        <div className="container-main">
                            <h3>注册</h3>
                            {/* 注册信息 */}
                            <small>注册以进行投票。</small>
                            <div className="container-item">
                                <form>
                                    <div className="div-li">
                                        <label className={"label-r"}>
                                            账户地址
                                            <input
                                                className={"input-r"}
                                                type="text"
                                                value={this.state.account}
                                                style={{width: "400px"}}
                                            />{" "}
                                        </label>
                                    </div>
                                    <div className="div-li">
                                        <label className={"label-r"}>
                                            姓名
                                            <input
                                                className={"input-r"}
                                                type="text"
                                                placeholder="例如: 张三"
                                                value={this.state.voterName}
                                                onChange={this.updateVoterName}
                                            />{" "}
                                        </label>
                                    </div>
                                    <div className="div-li">
                                        <label className={"label-r"}>
                                            电话号码 <span style={{color: "tomato"}}>*</span>
                                            <input
                                                className={"input-r"}
                                                type="number"
                                                placeholder="例如: 13812345678"
                                                value={this.state.voterPhone}
                                                onChange={this.updateVoterPhone}
                                            />
                                        </label>
                                    </div>
                                    <p className="note">
                                        {/* 提示信息 */}
                                        <span style={{color: "tomato"}}> 注意: </span>
                                        <br/> 确保您的账户地址和电话号码是正确的。 <br/> 如果提供的电话号码与管理员目录中注册的账户地址不匹配，管理员可能不会批准您的账户。
                                    </p>
                                    <button
                                        className="btn-add"
                                        disabled={
                                            this.state.voterPhone.length !== 11 || // 电话号码长度为11
                                            this.state.currentVoter.isVerified // 如果当前投票者已验证，则禁用按钮
                                        }
                                        onClick={this.registerAsVoter}
                                    >
                                        {this.state.currentVoter.isRegistered ? "更新" : "注册"}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div
                            className="container-main"
                            style={{
                                borderTop: this.state.currentVoter.isRegistered
                                    ? null
                                    : "1px solid",
                            }}
                        >
                            {/* 加载当前投票者信息 */}
                            {loadCurrentVoter(
                                this.state.currentVoter,
                                this.state.currentVoter.isRegistered
                            )}
                        </div>
                        {/* 如果是管理员，加载所有投票者信息 */}
                        {this.state.isAdmin ? (
                            <div
                                className="container-main"
                                style={{borderTop: "1px solid"}}
                            >
                                <small>总选民数: {this.state.voters.length}</small>
                                {loadAllVoters(this.state.voters)}
                            </div>
                        ) : null}
                    </>
                )}
            </>
        );
    }
}

// 加载当前投票者信息
export function loadCurrentVoter(voter, isRegistered) {
    return (
        <>
            <div
                className={"container-item " + (isRegistered ? "success" : "attention")}
            >
                {/* 当前注册信息 */}
                <center>您的注册信息</center>
            </div>
            <div
                className={"container-list " + (isRegistered ? "success" : "attention")}
            >
                {/* 当前投票者信息列表 */}
                <table>
                    <tr>
                        <th>账户地址</th>
                        <td>{voter.address}</td>
                    </tr>
                    <tr>
                        <th>姓名</th>
                        <td>{voter.name}</td>
                    </tr>
                    <tr>
                        <th>电话号码</th>
                        <td>{voter.phone}</td>
                    </tr>
                    <tr>
                        <th>是否已投票</th>
                        <td>{voter.hasVoted ? "是" : "否"}</td>
                    </tr>
                    <tr>
                        <th>是否已验证</th>
                        <td>{voter.isVerified ? "是" : "否"}</td>
                    </tr>
                    <tr>
                        <th>是否已注册</th>
                        <td>{voter.isRegistered ? "是" : "否"}</td>
                    </tr>
                </table>
            </div>
        </>
    );
}

// 加载所有投票者信息
export function loadAllVoters(voters) {
    const renderAllVoters = (voter) => {
        return (
            <>
                <div className="container-list success">
                    {/* 所有投票者信息列表 */}
                    <table>
                        <tr>
                            <th>账户地址</th>
                            <td>{voter.address}</td>
                        </tr>
                        <tr>
                            <th>姓名</th>
                            <td>{voter.name}</td>
                        </tr>
                        <tr>
                            <th>电话号码</th>
                            <td>{voter.phone}</td>
                        </tr>
                        <tr>
                            <th>是否已投票</th>
                            <td>{voter.hasVoted ? "是" : "否"}</td>
                        </tr>
                        <tr>
                            <th>是否已验证</th>
                            <td>{voter.isVerified ? "是" : "否"}</td>
                        </tr>
                        <tr>
                            <th>是否已注册</th>
                            <td>{voter.isRegistered ? "是" : "否"}</td>
                        </tr>
                    </table>
                </div>
            </>
        );
    };
    return (
        <>
            <div className="container-item success">
                {/* 所有投票者列表标题 */}
                <center>所有投票者列表</center>
            </div>
            {/* 渲染所有投票者 */}
            {voters.map(renderAllVoters)}
        </>
    );
}
