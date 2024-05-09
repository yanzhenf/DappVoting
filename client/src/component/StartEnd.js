import React from "react";
import {Link} from "react-router-dom";

const StartEnd = (props) => {
    // 定义按钮样式
    const btn = {
        display: "block",
        padding: "21px",
        margin: "7px",
        minWidth: "max-content",
        textAlign: "center",
        width: "333px",
        alignSelf: "center",
    };

    return (
        <div
            className="container-main"
            style={{borderTop: "1px solid", marginTop: "0px"}}
        >
            {!props.elStarted ? (
                <>
                    {/* 编辑此处以显示“再次开始选举”按钮 */}
                    {!props.elEnded ? (
                        <>
                            <div
                                className="container-item attention"
                                style={{display: "block"}}
                            >
                                <h2>不要忘记添加候选人。</h2>
                                <p>
                                    前往{" "}
                                    <Link
                                        title="添加新的"
                                        to="/addCandidate"
                                        style={{
                                            color: "black",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        添加候选人
                                    </Link>{" "}
                                    页面。
                                </p>
                            </div>
                            <div className="container-item">
                                <button type="submit" style={btn}>
                                    开始选举{props.elEnded ? "（再次）" : null}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="container-item">
                            <center>
                                <p>重新部署合约以再次开始选举。</p>
                            </center>
                        </div>
                    )}
                    {props.elEnded ? (
                        <div className="container-item">
                            <center>
                                <p>选举已结束。</p>
                            </center>
                        </div>
                    ) : null}
                </>
            ) : (
                <>
                    <div className="container-item">
                        <center>
                            <p>选举已开始。</p>
                        </center>
                    </div>
                    <div className="container-item">
                        <button
                            type="button"
                            onClick={props.endElFn} // 点击按钮结束选举
                            style={btn}
                        >
                            结束选举
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default StartEnd;
