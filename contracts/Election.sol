// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

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
    // 候选人模型
    struct Candidate {
        uint256 candidateId; // 候选人ID
        string header; // 头衔
        string slogan; // 口号
        uint256 voteCount; // 票数
    }
    mapping(uint256 => Candidate) public candidateDetails; // 候选人详情映射

    // 添加新候选人
    function addCandidate(string memory _header, string memory _slogan)
    public
        // 仅管理员可以添加
    onlyAdmin
    {
        Candidate memory newCandidate =
                        Candidate({
                candidateId: candidateCount,
                header: _header,
                slogan: _slogan,
                voteCount: 0
            });
        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }

    // 选举详情模型
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
    )
    public
        // 仅管理员可以设置
    onlyAdmin
    {
        electionDetails = ElectionDetails(
            _adminName,
            _adminEmail,
            _adminTitle,
            _electionTitle,
            _organizationTitle
        );
        start = true;
        end = false;
    }

    // 获取选举详情
    function getElectionDetails()
    public
    view
    returns (
        string memory adminName,
        string memory adminEmail,
        string memory adminTitle,
        string memory electionTitle,
        string memory organizationTitle
    )
    {
        return (
            electionDetails.adminName,
            electionDetails.adminEmail,
            electionDetails.adminTitle,
            electionDetails.electionTitle,
            electionDetails.organizationTitle
        );
    }

    // 获取候选人数量
    function getTotalCandidate() public view returns (uint256) {
        // 返回候选人总数
        return candidateCount;
    }

    // 获取投票者数量
    function getTotalVoter() public view returns (uint256) {
        // 返回投票者总数
        return voterCount;
    }

    // 投票者模型
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

    // 请求注册为投票者
    function registerAsVoter(string memory _name, string memory _phone) public {
        Voter memory newVoter =
                        Voter({
                voterAddress: msg.sender,
                name: _name,
                phone: _phone,
                hasVoted: false,
                isVerified: false,
                isRegistered: true
            });
        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
    }

    // 验证投票者
    function verifyVoter(bool _verifedStatus, address voterAddress)
    public
        // 仅管理员可以验证
    onlyAdmin
    {
        voterDetails[voterAddress].isVerified = _verifedStatus;
    }

    // 投票
    function vote(uint256 candidateId) public {
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);
        candidateDetails[candidateId].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
    }

    // 结束选举
    function endElection() public onlyAdmin {
        end = true;
        start = false;
    }

    // 获取选举开始和结束值
    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
}
