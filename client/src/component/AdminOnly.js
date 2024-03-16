import React from "react";

// 管理员专用组件
const AdminOnly = (props) => {
    return (
        <div className="container-item attention" style={{borderColor: "tomato"}}>
            <center>
                <div style={{margin: "17px"}}>
                    <h1>{props.page}</h1> {/* 页面标题 */}
                </div>
                <p>仅管理员访问。</p> {/* 仅管理员访问提示 */}
            </center>
        </div>
    );
};

export default AdminOnly;
