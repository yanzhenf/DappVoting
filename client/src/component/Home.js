import React, {Component} from "react";
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";

// 组件
import Navbar from "./Navbar/Navigation";
import NavbarAdmin from "./Navbar/NavigationAdmin";
import UserHome from "./UserHome";
import StartEnd from "./StartEnd";
import ElectionStatus from "./ElectionStatus";

// 合约
import getWeb3 from "../getWeb3";
import Election from "../contracts/Election.json";

// CSS
import "./Home.css";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ElectionInstance: undefined,
            account: null,
            web3: null,
            isAdmin: false,
            elStarted: false,
            elEnded: false,
            elDetails: {},
        };
    }

    componentDidMount = async () => {
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

            // 检查是否为管理员
            const admin = await this.state.ElectionInstance.methods.getAdmin().call();
            if (this.state.account === admin) {
                this.setState({isAdmin: true});
            }

            // 获取选举开始和结束值
            const start = await this.state.ElectionInstance.methods.getStart().call();
            this.setState({elStarted: start});
            const end = await this.state.ElectionInstance.methods.getEnd().call();
            this.setState({elEnded: end});

            // 从合约中获取选举详情
            const electionDetails = await this.state.ElectionInstance.methods
                .getElectionDetails()
                .call();

            this.setState({
                elDetails: {
                    adminName: electionDetails.adminName,
                    adminEmail: electionDetails.adminEmail,
                    adminTitle: electionDetails.adminTitle,
                    electionTitle: electionDetails.electionTitle,
                    organizationTitle: electionDetails.organizationTitle,
                },
            });
        } catch (error) {
            // 捕获任何可能出现的错误
            alert(`加载web3、账户或合约失败。请检查控制台以获取详细信息。`);
            console.error(error);
        }
    };

    // 结束选举
    endElection = async () => {
        try {
            await this.state.ElectionInstance.methods
                .endElection()
                .send({from: this.state.account, gas: 1000000});
            window.location.reload();
        } catch (error) {
            alert("结束选举时出错。");
            console.error("结束选举时出错:", error);
        }
    };

    // 开始选举
    startElection = async () => {
        try {
            await this.state.ElectionInstance.methods
                .startElection()
                .send({from: this.state.account, gas: 1000000});
            window.location.reload();
        } catch (error) {
            console.error("开始选举时出错:", error);
        }
    };

    // 注册并开始选举
    registerElection = async (data) => {
        try {
            await this.state.ElectionInstance.methods
                .setElectionDetails(
                    data.adminFName.toLowerCase() + " " + data.adminLName.toLowerCase(),
                    data.adminEmail.toLowerCase(),
                    data.adminTitle.toLowerCase(),
                    data.electionTitle.toLowerCase(),
                    data.organizationTitle.toLowerCase()
                )
                .send({from: this.state.account, gas: 1000000});
            window.location.reload();
        } catch (error) {
            alert("注册选举时出错。");
            console.error("注册选举时出错:", error);
        }
    };

    restartElection = async () => {
        try {
            await this.state.ElectionInstance.methods.resetElection().send({from: this.state.account});
            window.location.reload(); // 刷新页面或重新加载必要的数据
        } catch (error) {
            console.error("Error restarting election:", error);
        }
    };

    // 渲染管理员主页
    renderAdminHome = () => {
        const EMsg = (props) => {
            return <span style={{color: "tomato"}}>{props.msg}</span>;
        };

        const AdminHome = () => {
            // 包含管理员主页的组件
            const {
                handleSubmit,
                register,
                formState: {errors},
            } = useForm();

            const onSubmit = (data) => {
                this.registerElection(data);
            };

            return (
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {!this.state.elStarted && !this.state.elEnded ? (
                            <div className="container-main">
                                {/* 关于管理员 */}
                                <div className="about-admin">
                                    <h3>关于管理员</h3>
                                    <div className="container-item center-items">
                                        <div>
                                            <label className="label-home">
                                                全名{" "}
                                                {errors.adminFName && <EMsg msg="*必填"/>}
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="姓"
                                                    {...register("adminFName", {
                                                        required: true,
                                                    })}
                                                />
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="名"
                                                    {...register("adminLName")}
                                                />
                                            </label>

                                            <label className="label-home">
                                                电子邮件{" "}
                                                {errors.adminEmail && (
                                                    <EMsg msg={errors.adminEmail.message}/>
                                                )}
                                                <input
                                                    className="input-home"
                                                    placeholder="例如：you@example.com"
                                                    name="adminEmail"
                                                    {...register("adminEmail", {
                                                        required: "*必填",
                                                        pattern: {
                                                            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, // 电子邮件验证
                                                            message: "*无效",
                                                        },
                                                    })}
                                                />
                                            </label>

                                            <label className="label-home">
                                                职位或职称{" "}
                                                {errors.adminTitle && <EMsg msg="*必填"/>}
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="例如：人力资源主管"
                                                    {...register("adminTitle", {
                                                        required: true,
                                                    })}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* 关于选举 */}
                                <div className="about-election">
                                    <h3>关于选举</h3>
                                    <div className="container-item center-items">
                                        <div>
                                            <label className="label-home">
                                                选举标题{" "}
                                                {errors.electionTitle && <EMsg msg="*必填"/>}
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="例如：学校选举"
                                                    {...register("electionTitle", {
                                                        required: true,
                                                    })}
                                                />
                                            </label>
                                            <label className="label-home">
                                                组织名称{" "}
                                                {errors.organizationName && <EMsg msg="*必填"/>}
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="例如：Lifeline学院"
                                                    {...register("organizationTitle", {
                                                        required: true,
                                                    })}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : this.state.elStarted ? (
                            <UserHome el={this.state.elDetails}/>
                        ) : null}
                        <StartEnd
                            elStarted={this.state.elStarted}
                            elEnded={this.state.elEnded}
                            startElFn={this.startElection}
                            endElFn={this.endElection}
                            contract={this.state.ElectionInstance}
                            account={this.state.account}
                            refresh={() => window.location.reload()} // 传递刷新页面的函数
                        />
                        <ElectionStatus
                            elStarted={this.state.elStarted}
                            elEnded={this.state.elEnded}
                        />
                    </form>
                </div>
            );
        };
        return <AdminHome/>;
    };

    render() {
        if (!this.state.web3) {
            return (
                <>
                    <Navbar/>
                    <center>加载Web3、账户和合约中...</center>
                </>
            );
        }
        return (
            <>
                {this.state.isAdmin ? <NavbarAdmin/> : <Navbar/>}
                <div className="container-main">
                    <div className="container-item center-items info">
                        Metamask账户: {this.state.account}
                    </div>
                    {!this.state.elStarted && !this.state.elEnded ? (
                        <div className="container-item info">
                            <center>
                                <h3>选举尚未初始化。</h3>
                                {this.state.isAdmin ? (
                                    <p>设置选举。</p>
                                ) : (
                                    <p>请稍候...</p>
                                )}
                            </center>
                        </div>
                    ) : null}
                </div>
                {this.state.isAdmin ? (
                    <>
                        <this.renderAdminHome/>
                    </>
                ) : this.state.elStarted ? (
                    <>
                        <UserHome el={this.state.elDetails}/>
                    </>
                ) : !this.state.elStarted && this.state.elEnded ? (
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
            </>
        );
    }
}
