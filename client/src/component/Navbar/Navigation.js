import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

// 导航栏组件
export default function Navbar() {
    const [open, setOpen] = useState(false); // 状态：菜单是否打开
    return (
        <nav>
            {/* 链接到首页的头部 */}
            <NavLink to="/" className="header">
                <i className="fab fa-hive"></i> 首页
            </NavLink>
            {/* 导航链接列表 */}
            <ul
                className="navbar-links"
                style={{ width: "35%", transform: open ? "translateX(0px)" : "" }}
            >
                {/* 注册链接 */}
                <li>
                    <NavLink to="/Registration" activeClassName="nav-active">
                        <i className="far fa-registered" /> 注册
                    </NavLink>
                </li>
                {/* 投票链接 */}
                <li>
                    <NavLink to="/Voting" activeClassName="nav-active">
                        <i className="fas fa-vote-yea" /> 投票
                    </NavLink>
                </li>
                {/* 结果链接 */}
                <li>
                    <NavLink to="/Results" activeClassName="nav-active">
                        <i className="fas fa-poll-h" /> 结果
                    </NavLink>
                </li>
            </ul>
            {/* 菜单按钮 */}
            <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
        </nav>
    );
}
