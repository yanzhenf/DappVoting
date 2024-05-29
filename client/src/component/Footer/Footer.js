import React from "react";

import "./Footer.css";

// Footer 组件
const Footer = () => (
    <>
      {/* 底部块 */}
      <div className="footer-block"></div>
      {/* 底部内容 */}
      <div className="footer">
        <div className="footer-container">
          {/* GitHub 项目链接 */}
          <p>
            查看此项目在{" "}
            <a
                className="profile"
                href="https://gitee.com/yan-zhenfeng/DappVoting.git"
                target="_blank"
                rel="noopener noreferrer"
            >
              Gitee
            </a>
            上的链接。
          </p>
          {/* 制作者信息 */}
          <p>
            由{" "}
            <a
                className="profile"
                href="https://yanhuina.youtrack.cloud/projects"
                target="_blank"
                rel="noopener noreferrer"
            >
              逢考必过
            </a>{" "}
            制作 <i className="fas fa-heartbeat" />。
          </p>
        </div>
      </div>
    </>
);

export default Footer;
