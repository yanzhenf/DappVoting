// Node 模块
import React, {Component} from "react";
import {Link} from "react-router-dom";

// 组件
import Navbar from "../Navbar/Navigation"; // 导航栏
import NavbarAdmin from "../Navbar/NavigationAdmin"; // 管理员导航栏
import NotInit from "../NotInit"; // 未初始化组件

// 合约
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";

// CSS
import "./Voting.css";

export default class Voting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined, // 选举合约实例
            account: null, // 当前账户
            web3: null, // web3实例
            isAdmin: false, // 是否管理员
            candidateCount: undefined, // 候选人数量
            candidates: [], // 候选人列表
            isElStarted: false, // 选举是否开始
            isElEnded: false, // 选举是否结束
            currentVoter: {
                address: undefined, // 当前投票人地址
                name: null, // 姓名
                phone: null, // 电话
                hasVoted: false, // 是否已投票
                isVerified: false, // 是否已验证
                isRegistered: false, // 是否已注册
            },
        };
    }

    // 组件挂载完成后执行的操作
    componentDidMount = async () => {
        // 刷新页面一次
        if (!window.location.hash) {
            window.location = window.location + "#loaded";
            window.location.reload();
        }
        try {
            // 获取web3实例
            const web3 = await getWeb3();

            // 获取用户账户
            const accounts = await web3.eth.getAccounts();

            // 获取合约实例
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Election.networks[networkId];
            const instance = new web3.eth.Contract(
                Election.abi,
                deployedNetwork && deployedNetwork.address
            );

            // 设置web3、账户和合约到state中
            this.setState({
                web3: web3,
                ElectionInstance: instance,
                account: accounts[0],
            });

            // 获取候选人总数
            const candidateCount = await this.state.ElectionInstance.methods
                .getTotalCandidate()
                .call();
            this.setState({candidateCount: candidateCount});

            // 获取选举开始和结束状态
            const start = await this.state.ElectionInstance.methods.getStart().call();
            this.setState({isElStarted: start});
            const end = await this.state.ElectionInstance.methods.getEnd().call();
            this.setState({isElEnded: end});

            // 加载候选人详情
            for (let i = 1; i <= this.state.candidateCount; i++) {
                const candidate = await this.state.ElectionInstance.methods
                    .candidateDetails(i - 1)
                    .call();
                this.state.candidates.push({
                    id: candidate.candidateId,
                    header: candidate.header,
                    slogan: candidate.slogan,
                });
            }
            this.setState({candidates: this.state.candidates});

            // 加载当前投票人信息
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

            // 管理员账户和验证
            const admin = await this.state.ElectionInstance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({isAdmin: true});
            }
        } catch (error) {
            // 捕获上述操作的任何错误
            alert(
                `加载web3、账户或合约失败，请查看控制台以获取详细信息。`
            );
            console.error(error);
        }
    };

    // 渲染候选人信息
    renderCandidates = (candidate) => {
        const castVote = async (id) => {
            await this.state.ElectionInstance.methods
                .vote(id)
                .send({from: this.state.account, gas: 1000000});
            window.location.reload();
        };
        const confirmVote = (id, header) => {
            var r = window.confirm(
                "投给 " + header + "（编号：" + id + "）。确实要投票吗？"
            );
            if (r === true) {
                castVote(id);
            }
        };
        return (
            <div className="container-item">
                <div className="candidate-info">
                    <h2>
                        {candidate.header} <small>#{candidate.id}</small>
                    </h2>
                    <p className="slogan">{candidate.slogan}</p>
                </div>
                <div className="vote-btn-container">
                    <button
                        onClick={() => confirmVote(candidate.id, candidate.header)}
                        className="vote-bth"
                        disabled={
                            !this.state.currentVoter.isRegistered ||
                            !this.state.currentVoter.isVerified ||
                            this.state.currentVoter.hasVoted
                        }
                    >
                        投票
                    </button>
                </div>
            </div>
        );
    };

    render() {
        if (!this.state.web3) {
            return (
                <>
                    {this.state.isAdmin ? <NavbarAdmin/> : <Navbar/>}
                    <center>加载中，请稍候...</center>
                </>
            );
        }

        return (
            <>
                {this.state.isAdmin ? <NavbarAdmin/> : <Navbar/>}
                <div>
                    {!this.state.isElStarted && !this.state.isElEnded ? (
                        <NotInit/>
                    ) : this.state.isElStarted && !this.state.isElEnded ? (
                        <>
                            {this.state.currentVoter.isRegistered ? (
                                this.state.currentVoter.isVerified ? (
                                    this.state.currentVoter.hasVoted ? (
                                        <div className="container-item success">
                                            <div>
                                                <strong>您已投票。</strong>
                                                <p/>
                                                <center>
                                                    <Link
                                                        to="/Results"
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "underline",
                                                        }}
                                                    >
                                                        查看结果
                                                    </Link>
                                                </center>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="container-item info">
                                            <center>请进行投票。</center>
                                        </div>
                                    )
                                ) : (
                                    <div className="container-item attention">
                                        <center>请等待管理员验证。</center>
                                    </div>
                                )
                            ) : (
                                <>
                                    <div className="container-item attention">
                                        <center>
                                            <p>您尚未注册，请先注册。</p>
                                            <br/>
                                            <Link
                                                to="/Registration"
                                                style={{color: "black", textDecoration: "underline"}}
                                            >
                                                前往注册页面
                                            </Link>
                                        </center>
                                    </div>
                                </>
                            )}
                            <div className="container-main">
                                <h2>候选人</h2>
                                <small>候选人总数：{this.state.candidates.length}</small>
                                {this.state.candidates.length < 1 ? (
                                    <div className="container-item attention">
                                        <center>无候选人可供投票。</center>
                                    </div>
                                ) : (
                                    <>
                                        {this.state.candidates.map(this.renderCandidates)}
                                        <div
                                            className="container-item"
                                            style={{border: "1px solid black"}}
                                        >
                                            <center>以上为全部候选人。</center>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : !this.state.isElStarted && this.state.isElEnded ? (
                        <>
                            <div className="container-item attention">
                                <center>
                                    <h3>选举已结束。</h3>
                                    <br/>
                                    <Link
                                        to="/Results"
                                        style={{color: "black", textDecoration: "underline"}}
                                    >
                                        查看结果
                                    </Link>
                                </center>
                            </div>
                        </>
                    ) : null}
                </div>
            </>
        );
    }
}
