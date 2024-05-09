import React from "react";

// 选举状态组件
const ElectionStatus = (props) => {
  // 样式对象定义
  const electionStatus = {
    padding: "11px",
    margin: "7px",
    width: "100%",
    border: "1px solid tomato",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    borderRadius: "0.5em",
    overflow: "auto",
    alignItems: "center",
    justifyContent: "space-around",
    display: "flex",
  };

  return (
      <div
          className="container-main"
          style={{ borderTop: "1px solid", marginTop: "0px" }}
      >
        <h3>选举状态</h3> {/* 选举状态标题 */}
        <div style={electionStatus}>
          <p>开始：{props.elStarted ? "是" : "否"}</p> {/* 选举是否开始 */}
          <p>结束：{props.elEnded ? "是" : "否"}</p> {/* 选举是否结束 */}
        </div>
        <div className="container-item" />
      </div>
  );
};

export default ElectionStatus;
