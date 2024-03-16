// Node 模块
import React, {Component} from "react";
import {Link} from "react-router-dom";

// 组件
import Navbar from "../Navbar/Navigation"; // 导航栏组件
import NavbarAdmin from "../Navbar/NavigationAdmin"; // 管理员导航栏组件
import NotInit from "../NotInit"; // 未初始化组件

// 合约
import getWeb3 from "../../getWeb3"; // 获取 Web3 实例
import Election from "../../contracts/Election.json"; // 选举合约 ABI

// CSS
import "./Results.css";

export default class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined, // 选举合约实例
            account: null, // 用户账户
            web3: null, // Web3 实例
            isAdmin: false, // 是否为管理员
            candidateCount: undefined, // 候选人数量
            candidates: [], // 候选人列表
            isElStarted: false, // 选举是否已开始
            isElEnded: false, // 选举是否已结束
        };
    }

    componentDidMount = async () => {
        // 页面刷新仅执行一次
        if (!window.location.hash) {
            window.location = window.location + "#loaded";
            window.location.reload();
        }
        try {
            // 获取网络提供程序和 Web3 实例
            const web3 = await getWeb3();

            // 使用 Web3 获取用户账户
            const accounts = await web3.eth.getAccounts();

            // 获取合约实例
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Election.networks[networkId];
            const instance = new web3.eth.Contract(
                Election.abi,
                deployedNetwork && deployedNetwork.address
            );

            // 将 Web3、账户和合约设置为状态，并继续与合约方法交互的示例。
            this.setState({web3, ElectionInstance: instance, account: accounts[0]});

            // 获取候选人总数
            const candidateCount = await this.state.ElectionInstance.methods
                .getTotalCandidate()
                .call();
            this.setState({candidateCount: candidateCount});

            // 获取开始和结束值
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
                    voteCount: candidate.voteCount,
                });
            }

            this.setState({candidates: this.state.candidates});

            // 管理员账户和验证
            const admin = await this.state.ElectionInstance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({isAdmin: true});
            }
        } catch (error) {
            // 捕获以上操作的任何错误。
            alert(
                `加载 Web3、账户或合约失败。请查看控制台以获取详细信息。`
            );
            console.error(error);
        }
    };

    render() {
        if (!this.state.web3) {
            // 如果未加载 Web3，则显示加载信息
            return (
                <>
                    {this.state.isAdmin ? <NavbarAdmin/> : <Navbar/>}
                    <center>加载 Web3、账户和合约中...</center>
                </>
            );
        }

        return (
            <>
                {this.state.isAdmin ? <NavbarAdmin/> : <Navbar/>}
                <br/>
                <div>
                    {!this.state.isElStarted && !this.state.isElEnded ? (
                        <NotInit/>
                    ) : this.state.isElStarted && !this.state.isElEnded ? (
                        <div className="container-item attention">
                            <center>
                                <h3>选举正在进行中。</h3>
                                <p>选举结束后将显示结果。</p>
                                <p>请前往投票页面进行投票（如果尚未投票）。</p>
                                <br/>
                                <Link
                                    to="/Voting"
                                    style={{color: "black", textDecoration: "underline"}}
                                >
                                    投票页面
                                </Link>
                            </center>
                        </div>
                    ) : !this.state.isElStarted && this.state.isElEnded ? (
                        displayResults(this.state.candidates)
                    ) : null}
                </div>
            </>
        );
    }
}

function displayWinner(candidates) {
    const getWinner = (candidates) => {
        // 返回获得最多票数的候选人对象
        let maxVoteRecived = 0;
        let winnerCandidate = [];
        for (let i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVoteRecived) {
                maxVoteRecived = candidates[i].voteCount;
                winnerCandidate = [candidates[i]];
            } else if (candidates[i].voteCount === maxVoteRecived) {
                winnerCandidate.push(candidates[i]);
            }
        }
        return winnerCandidate;
    };
    const renderWinner = (winner) => {
        return (
            <div className="container-winner">
                <div className="winner-info">
                    <p className="winner-tag">获胜者！</p>
                    <h2> {winner.header}</h2>
                    <p className="winner-slogan">{winner.slogan}</p>
                </div>
                <div className="winner-votes">
                    <div className="votes-tag">总票数:</div>
                    <div className="vote-count">{winner.voteCount}</div>
                </div>
            </div>
        );
    };
    const winnerCandidate = getWinner(candidates);
    return <>{winnerCandidate.map(renderWinner)}</>;
}

export function displayResults(candidates) {
    const renderResults = (candidate) => {
        return (
            <tr>
                <td>{candidate.id}</td>
                <td>{candidate.header}</td>
                <td>{candidate.voteCount}</td>
            </tr>
        );
    };
    return (
        <>
            {candidates.length > 0 ? (
                <div className="container-main">{displayWinner(candidates)}</div>
            ) : null}
            <div className="container-main" style={{borderTop: "1px solid"}}>
                <h2>结果</h2>
                <small>候选人总数: {candidates.length}</small>
                {candidates.length < 1 ? (
                    <div className="container-item attention">
                        <center>暂无候选人。</center>
                    </div>
                ) : (
                    <>
                        <div className="container-item">
                            <table>
                                <tr>
                                    <th>编号</th>
                                    <th>候选人</th>
                                    <th>得票数</th>
                                </tr>
                                {candidates.map(renderResults)}
                            </table>
                        </div>
                        <div
                            className="container-item"
                            style={{border: "1px solid black"}}
                        >
                            <center>以上为所有内容。</center>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
