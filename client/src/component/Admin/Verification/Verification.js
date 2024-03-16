import React, {Component} from "react";
import Navbar from "../../Navbar/Navigation"; // 导入普通用户导航栏组件
import NavbarAdmin from "../../Navbar/NavigationAdmin"; // 导入管理员导航栏组件
import AdminOnly from "../../AdminOnly"; // 导入管理员权限组件
import getWeb3 from "../../../getWeb3"; // 导入获取 Web3 实例的函数
import Election from "../../../contracts/Election.json"; // 导入选举合约 ABI
import "./Verification.css";

// 类组件 Registration
export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined, // 选举合约实例
            account: null, // 用户账户
            web3: null, // Web3 实例
            isAdmin: false, // 是否是管理员
            voterCount: undefined, // 选民数量
            voters: [], // 选民列表
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
            this.setState({web3, ElectionInstance: instance, account: accounts[0]});

            // 获取候选人总数
            const candidateCount = await this.state.ElectionInstance.methods
                .getTotalCandidate()
                .call();
            this.setState({candidateCount: candidateCount});

            // Admin 账户和验证
            const admin = await this.state.ElectionInstance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({isAdmin: true});
            }

            // 获取选民总数
            const voterCount = await this.state.ElectionInstance.methods
                .getTotalVoter()
                .call();
            this.setState({voterCount: voterCount});

            // 加载所有选民
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
        } catch (error) {
            // 捕获以上操作中的任何错误
            alert(`无法加载Web3、账户或合约。请检查控制台以获取详细信息。`);
            console.error(error);
        }
    };

    // 渲染未验证的选民列表
    renderUnverifiedVoters = (voter) => {
        // 根据选民的验证状态更新选民状态
        const verifyVoter = async (verifiedStatus, address) => {
            await this.state.ElectionInstance.methods
                .verifyVoter(verifiedStatus, address)
                .send({from: this.state.account, gas: 1000000});
            window.location.reload();
        };

        return (
            <>
                {/* 如果选民已验证，则显示选民详情 */}
                {voter.isVerified ? (
                    <div className="container-list success">
                        <p style={{margin: "7px 0px"}}>地址：{voter.address}</p>
                        <table>
                            <tr>
                                <th>姓名</th>
                                <th>电话</th>
                                <th>是否投票</th>
                            </tr>
                            <tr>
                                <td>{voter.name}</td>
                                <td>{voter.phone}</td>
                                <td>{voter.hasVoted ? "是" : "否"}</td>
                            </tr>
                        </table>
                    </div>
                ) : null}
                {/* 如果选民未验证，则显示选民验证按钮 */}
                <div
                    className="container-list attention"
                    style={{display: voter.isVerified ? "none" : null}}
                >
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
                            <th>电话</th>
                            <td>{voter.phone}</td>
                        </tr>
                        <tr>
                            <th>是否投票</th>
                            <td>{voter.hasVoted ? "是" : "否"}</td>
                        </tr>
                        <tr>
                            <th>已验证</th>
                            <td>{voter.isVerified ? "是" : "否"}</td>
                        </tr>
                        <tr>
                            <th>已注册</th>
                            <td>{voter.isRegistered ? "是" : "否"}</td>
                        </tr>
                    </table>
                    <div style={{}}>
                        {/* 显示验证按钮 */}
                        <button
                            className="btn-verification approve"
                            disabled={voter.isVerified}
                            onClick={() => verifyVoter(true, voter.address)}
                        >
                            批准
                        </button>
                    </div>
                </div>
            </>
        );
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
                    <AdminOnly page="验证页面"/>
                </>
            );
        }
        // 渲染验证页面
        return (
            <>
                <NavbarAdmin/>
                <div className="container-main">
                    <h3>验证</h3>
                    <small>总选民数：{this.state.voters.length}</small>
                    {/* 如果没有选民注册，显示提示信息 */}
                    {this.state.voters.length < 1 ? (
                        <div className="container-item info">尚未有选民注册。</div>
                    ) : (
                        <>
                            {/* 显示已注册选民列表标题 */}
                            <div className="container-item info">
                                <center>已注册选民列表</center>
                            </div>
                            {/* 显示已注册选民列表 */}
                            {this.state.voters.map(this.renderUnverifiedVoters)}
                        </>
                    )}
                </div>
            </>
        );
    }
}
