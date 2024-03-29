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
                href="https://github.com/arlbibek/dVoting"
                target="_blank"
                rel="noopener noreferrer"
            >
              GitHub
            </a>
            上的链接。
          </p>
          {/* 制作者信息 */}
          <p>
            由{" "}
            <a
                className="profile"
                href="https://arlbibek.github.io"
                target="_blank"
                rel="noopener noreferrer"
            >
              Bibek Aryal
            </a>{" "}
            制作 <i className="fas fa-heartbeat" />。
          </p>
        </div>
      </div>
    </>
);

export default Footer;
