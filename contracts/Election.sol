// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

contract Election {
    address public admin; // 管理员地址
    uint256 candidateCount; // 候选人数量
    uint256 voterCount; // 投票者数量
    bool start; // 是否开始投票
    bool end; // 是否结束投票

    constructor() public {
        // 初始化默认值
        admin = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;
    }

    function getAdmin() public view returns (address) {
        // 返回部署合约的账户地址（即管理员）
        return admin;
    }

    modifier onlyAdmin() {
        // 仅管理员访问的修饰器
        require(msg.sender == admin);
        _;
    }

    struct Candidate {
        uint256 candidateId; // 候选人ID
        string header; // 头衔
        string slogan; // 口号
        uint256 voteCount; // 票数
    }

    mapping(uint256 => Candidate) public candidateDetails; // 候选人详情映射

    function addCandidate(string memory _header, string memory _slogan) public onlyAdmin {
        Candidate memory newCandidate = Candidate({
            candidateId: candidateCount,
            header: _header,
            slogan: _slogan,
            voteCount: 0
        });
        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }

    struct ElectionDetails {
        string adminName; // 管理员姓名
        string adminEmail; // 管理员邮箱
        string adminTitle; // 管理员职称
        string electionTitle; // 选举标题
        string organizationTitle; // 组织标题
    }

    ElectionDetails electionDetails;

    function setElectionDetails(
        string memory _adminName,
        string memory _adminEmail,
        string memory _adminTitle,
        string memory _electionTitle,
        string memory _organizationTitle
    ) public onlyAdmin {
        electionDetails = ElectionDetails(
            _adminName,
            _adminEmail,
            _adminTitle,
            _electionTitle,
            _organizationTitle
        );
        start = true;
        end = false;

        // Reset voter status for the new election
        for (uint i = 0; i < voters.length; i++) {
            voterDetails[voters[i]].isVerified = false;
            voterDetails[voters[i]].hasVoted = false;
            voterDetails[voters[i]].isRegistered = false;
        }
        voterCount = 0;
        delete voters;
    }

    function getElectionDetails() public view returns (
        string memory adminName,
        string memory adminEmail,
        string memory adminTitle,
        string memory electionTitle,
        string memory organizationTitle
    ) {
        return (
            electionDetails.adminName,
            electionDetails.adminEmail,
            electionDetails.adminTitle,
            electionDetails.electionTitle,
            electionDetails.organizationTitle
        );
    }

    function getTotalCandidate() public view returns (uint256) {
        return candidateCount;
    }

    function getTotalVoter() public view returns (uint256) {
        return voterCount;
    }

    struct Voter {
        address voterAddress; // 投票者地址
        string name; // 姓名
        string phone; // 电话
        bool isVerified; // 是否验证
        bool hasVoted; // 是否投票
        bool isRegistered; // 是否注册
    }

    address[] public voters; // 存储投票者地址的数组
    mapping(address => Voter) public voterDetails; // 投票者详情映射

    function registerAsVoter(string memory _name, string memory _phone) public {
        require(!voterDetails[msg.sender].isRegistered, "Already registered");

        Voter memory newVoter = Voter({
            voterAddress: msg.sender,
            name: _name,
            phone: _phone,
            hasVoted: false,
            isVerified: false, // Require admin verification
            isRegistered: true
        });
        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
    }

    function verifyVoter(bool _verifiedStatus, address voterAddress) public onlyAdmin {
        voterDetails[voterAddress].isVerified = _verifiedStatus;
    }

    function vote(uint256 candidateId) public {
        require(!voterDetails[msg.sender].hasVoted, "Already voted");
        require(voterDetails[msg.sender].isVerified, "Not verified");
        require(start, "Election not started");
        require(!end, "Election ended");

        candidateDetails[candidateId].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
    }

    function endElection() public onlyAdmin {
        end = true;
        start = false;
        // 在结束选举时，记录选举历史
        addElectionHistory();
    }

    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }

    struct ElectionHistory {
        string electionTitle;
        string organizationTitle;
        Candidate winner;
    }

    ElectionHistory[] public electionHistories;

    function addElectionHistory() internal {
        Candidate memory winner = candidateDetails[0];
        for (uint256 i = 1; i < candidateCount; i++) {
            if (candidateDetails[i].voteCount > winner.voteCount) {
                winner = candidateDetails[i];
            }
        }
        electionHistories.push(ElectionHistory({
            electionTitle: electionDetails.electionTitle,
            organizationTitle: electionDetails.organizationTitle,
            winner: winner
        }));
    }

    function getElectionHistory() public view returns (ElectionHistory[] memory) {
        return electionHistories;
    }

    function resetElection() public onlyAdmin {
        for (uint i = 0; i < candidateCount; i++) {
            delete candidateDetails[i];
        }
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;

        // Clear voter details
        for (uint i = 0; i < voters.length; i++) {
            delete voterDetails[voters[i]];
        }
        delete voters;
    }
}
