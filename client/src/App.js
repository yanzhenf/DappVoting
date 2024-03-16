import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// 导入主页组件
import Home from "./component/Home";

// 导入投票组件
import Voting from "./component/Voting/Voting";

// 导入结果组件
import Results from "./component/Results/Results";

// 导入注册组件
import Registration from "./component/Registration/Registration";

// 导入添加候选人组件
import AddCandidate from "./component/Admin/AddCandidate/AddCandidate";

// 导入验证组件
import Verification from "./component/Admin/Verification/Verification";

// 导入测试组件
import test from "./component/test";

// 导入页脚组件
import Footer from "./component/Footer/Footer";

import "./App.css";

// 应用程序组件
export default class App extends Component {
  render() {
    return (
        <div className="App">
          {/* 使用路由器包裹应用程序 */}
          <Router>
            {/* 使用Switch包裹所有路由 */}
            <Switch>
              {/* 主页路由 */}
              <Route exact path="/" component={Home} />

              {/* 添加候选人路由 */}
              <Route exact path="/AddCandidate" component={AddCandidate} />

              {/* 投票路由 */}
              <Route exact path="/Voting" component={Voting} />

              {/* 结果路由 */}
              <Route exact path="/Results" component={Results} />

              {/* 注册路由 */}
              <Route exact path="/Registration" component={Registration} />

              {/* 验证路由 */}
              <Route exact path="/Verification" component={Verification} />

              {/* 测试路由 */}
              <Route exact path="/test" component={test} />

              {/* 未匹配到任何路由时显示404页面 */}
              <Route exact path="*" component={NotFound} />
            </Switch>
          </Router>

          {/* 页脚组件 */}
          <Footer />
        </div>
    );
  }
}

// 404页面组件
class NotFound extends Component {
  render() {
    return (
        <>
          <h1>404 NOT FOUND!</h1>
          <center>
            <p>
              找不到页面。
              <br />
              返回<Link to="/" style={{ color: "black", textDecoration: "underline" }}>主页</Link>
            </p>
          </center>
        </>
    );
  }
}
