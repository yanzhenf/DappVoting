import React, {useState} from "react";
import {NavLink} from "react-router-dom";

import "./Navbar.css";

// 管理员导航栏组件
export default function NavbarAdmin() {
    const [open, setOpen] = useState(false); // 状态：菜单是否打开
    return (
        <nav>
            {/* 导航栏头部 */}
            <div className="header">
                <NavLink to="/">
                    <i className="fab fa-hive"/> 管理员
                </NavLink>
            </div>
            {/* 导航链接列表 */}
            <ul
                className="navbar-links"
                style={{transform: open ? "translateX(0px)" : ""}}
            >
                {/* 验证链接 */}
                <li>
                    <NavLink to="/Verification" activeClassName="nav-active">
                        验证
                    </NavLink>
                </li>
                {/* 添加候选人链接 */}
                <li>
                    <NavLink to="/AddCandidate" activeClassName="nav-active">
                        添加候选人
                    </NavLink>
                </li>
                {/* 注册链接 */}
                <li>
                    <NavLink to="/Registration" activeClassName="nav-active">
                        <i className="far fa-registered"/> 注册
                    </NavLink>
                </li>
                {/* 投票链接 */}
                <li>
                    <NavLink to="/Voting" activeClassName="nav-active">
                        <i className="fas fa-vote-yea"/> 投票
                    </NavLink>
                </li>
                {/* 结果链接 */}
                <li>
                    <NavLink to="/Results" activeClassName="nav-active">
                        <i className="fas fa-poll-h"/> 结果
                    </NavLink>
                </li>
            </ul>
            {/* 菜单按钮 */}
            <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
        </nav>
    );
}
