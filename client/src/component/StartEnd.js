import React, { useState } from "react";
import { Link } from "react-router-dom";

const StartEnd = (props) => {
    const btn = {
        display: "block",
        padding: "21px",
        margin: "7px",
        minWidth: "max-content",
        textAlign: "center",
        width: "333px",
        alignSelf: "center",
    };

    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const fetchElectionHistory = async () => {
        console.log("Fetching election history...");

        if (!props.contract) {
            console.error("Contract is not loaded");
            return;
        }

        try {
            const electionHistory = await props.contract.methods.getElectionHistory().call();
            const formattedHistory = electionHistory.map((election, index) => ({
                id: index,
                title: election.electionTitle,
                organization: election.organizationTitle,
                winnerHeader: election.winner.header,
                winnerSlogan: election.winner.slogan,
                winnerVoteCount: election.winner.voteCount,
            }));

            console.log("Election history fetched successfully:", formattedHistory);
            setHistory(formattedHistory);
            setShowHistory(true);
        } catch (error) {
            console.error("Error fetching election history:", error);
        }
    };

    const restartElection = async () => {
        console.log("Restarting election...");

        try {
            if (!props.account) {
                console.error("No account address provided");
                return;
            }

            console.log("Account address:", props.account);
            await props.contract.methods.resetElection().send({ from: props.account });
            setShowHistory(false);
            setHistory([]);
            props.refresh(); // This function should reload the page or refresh necessary data
        } catch (error) {
            console.error("Error restarting election:", error);
        }
    };

    return (
        <div className="container-main" style={{ borderTop: "1px solid", marginTop: "0px" }}>
            {!props.elStarted ? (
                <>
                    {!props.elEnded ? (
                        <>
                            <div className="container-item attention" style={{ display: "block" }}>
                                <h2>不要忘记添加候选人。</h2>
                                <p>
                                    前往{" "}
                                    <Link
                                        title="添加新的"
                                        to="/addCandidate"
                                        style={{ color: "black", textDecoration: "underline" }}
                                    >
                                        添加候选人
                                    </Link>{" "}
                                    页面。
                                </p>
                            </div>
                            <div className="container-item">
                                <button type="submit" style={btn} onClick={props.startElFn}>
                                    开始选举{props.elEnded ? "（再次）" : null}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="container-item">
                            <center>
                                <button
                                    type="button"
                                    onClick={() => restartElection(props.account)}
                                    style={btn}
                                >
                                    开始新的选举
                                </button>
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
                        <button type="button" onClick={props.endElFn} style={btn}>
                            结束选举
                        </button>
                    </div>
                </>
            )}

            <div className="container-item">
                <button type="button" onClick={fetchElectionHistory} style={btn}>
                    查看投票历史
                </button>
            </div>

            {showHistory && (
                <div className="container-item">
                    <table>
                        <thead>
                        <tr>
                            <th>选举ID</th>
                            <th>选举标题</th>
                            <th>组织标题</th>
                            <th>获胜者头衔</th>
                            <th>获胜者口号</th>
                            <th>获胜者票数</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((election, index) => (
                            <tr key={index}>
                                <td>{election.id}</td>
                                <td>{election.title}</td>
                                <td>{election.organization}</td>
                                <td>{election.winnerHeader}</td>
                                <td>{election.winnerSlogan}</td>
                                <td>{election.winnerVoteCount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StartEnd;
