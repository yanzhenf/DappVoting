import React, { Component } from "react";
import Navbar from "../../Navbar/Navigation"; // 导入普通用户导航栏组件
import NavbarAdmin from "../../Navbar/NavigationAdmin"; // 导入管理员导航栏组件
import getWeb3 from "../../../getWeb3"; // 导入获取 Web3 实例的函数
import Election from "../../../contracts/Election.json"; // 导入选举合约 ABI
import AdminOnly from "../../AdminOnly"; // 导入管理员权限组件
import "./AddCandidate.css";

// 类组件 AddCandidate
export default class AddCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined, // 选举合约实例
      web3: null, // Web3 实例
      accounts: null, // 用户账户
      isAdmin: false, // 是否是管理员
      header: "", // 候选人姓名
      slogan: "", // 候选人口号
      candidates: [], // 候选人列表
      candidateCount: undefined, // 候选人数量
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

      // 获取候选人总数
      const candidateCount = await this.state.ElectionInstance.methods
          .getTotalCandidate()
          .call();
      this.setState({ candidateCount: candidateCount });

      // 检查当前账户是否是管理员
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // 加载候选人详情
      for (let i = 0; i < this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
            .candidateDetails(i)
            .call();
        this.state.candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
        });
      }

      this.setState({ candidates: this.state.candidates });
    } catch (error) {
      console.error(error);
      alert(
          `无法加载Web3、账户或合约。请检查控制台以获取详细信息。`
      );
    }
  };

  // 更新候选人姓名
  updateHeader = (event) => {
    this.setState({ header: event.target.value });
  };

  // 更新候选人口号
  updateSlogan = (event) => {
    this.setState({ slogan: event.target.value });
  };

  // 添加候选人
  addCandidate = async () => {
    await this.state.ElectionInstance.methods
        .addCandidate(this.state.header, this.state.slogan)
        .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };

  // 渲染组件
  render() {
    // 如果没有获取到 Web3 实例，显示加载信息
    if (!this.state.web3) {
      return (
          <>
            {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
            <center>加载Web3、账户和合约中...</center>
          </>
      );
    }
    // 如果当前用户不是管理员，显示权限不足页面
    if (!this.state.isAdmin) {
      return (
          <>
            <Navbar />
            <AdminOnly page="添加候选人页面" />
          </>
      );
    }
    // 渲染添加候选人页面
    return (
        <>
          <NavbarAdmin />
          <div className="container-main">
            <h2>添加新候选人</h2>
            <small>候选人总数: {this.state.candidateCount}</small>
            <div className="container-item">
              <form className="form">
                <label className={"label-ac"}>
                  姓名
                  <input
                      className={"input-ac"}
                      type="text"
                      placeholder="例如：马库斯"
                      value={this.state.header}
                      onChange={this.updateHeader}
                  />
                </label>
                <label className={"label-ac"}>
                  口号
                  <input
                      className={"input-ac"}
                      type="text"
                      placeholder="例如：事实如此"
                      value={this.state.slogan}
                      onChange={this.updateSlogan}
                  />
                </label>
                <button
                    className="btn-add"
                    disabled={
                        this.state.header.length < 3 || this.state.header.length > 21
                    }
                    onClick={this.addCandidate}
                >
                  添加
                </button>
              </form>
            </div>
          </div>
          {loadAdded(this.state.candidates)}
        </>
    );
  }
}

// 渲染已添加的候选人列表
export function loadAdded(candidates) {
  const renderAdded = (candidate) => {
    return (
        <>
          <div className="container-list success">
            <div
                style={{
                  maxHeight: "21px",
                  overflow: "auto",
                }}
            >
              {candidate.id}. <strong>{candidate.header}</strong>:{" "}
              {candidate.slogan}
            </div>
          </div>
        </>
    );
  };

  return (
      <div className="container-main" style={{ borderTop: "1px solid" }}>
        <div className="container-item info">
          <center>候选人列表</center>
        </div>
        {candidates.length < 1 ? (
            <div className="container-item alert">
              <center>没有添加候选人。</center>
            </div>
        ) : (
            <div
                className="container-item"
                style={{
                  display: "block",
                  backgroundColor: "#DDFFFF",
                }}
            >
              {candidates.map(renderAdded)}
            </div>
        )}
      </div>
  );
}
