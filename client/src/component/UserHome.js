import React from "react";

// 用户主页组件
function UserHome(props) {
  return (
      <div>
        <div className="container-main">
          <div className="container-list title">
            {/* 选举标题 */}
            <h1>{props.el.electionTitle}</h1>
            <br />
            {/* 组织名称 */}
            <center>{props.el.organizationTitle}</center>
            {/* 选举详情表格 */}
            <table style={{ marginTop: "21px" }}>
              <tr>
                <th>管理员</th>
                {/* 管理员姓名和职称 */}
                <td>
                  {props.el.adminName} ({props.el.adminTitle})
                </td>
              </tr>
              <tr>
                <th>联系方式</th>
                {/* 管理员电子邮件 */}
                <td style={{ textTransform: "none" }}>{props.el.adminEmail}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
  );
}

export default UserHome;
