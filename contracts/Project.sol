// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Project {
    enum State {Ongoing, Failed, Succeeded, Paidoff}

    address payable private creator;
    string private title;
    string private description;
    uint256 private target;
    uint256 private startTime;
    uint256 private deadline;
    uint256 private completeTime;
    uint256 private endTime;
    uint256 private balance = 0;
    uint256 private total = 0;
    State private state = State.Ongoing;
    address payable[] private contributors;
    mapping(address => uint256) private contributions;
    
    struct Usage{
        string title;
        string description;
        uint256 amount;
        uint256 approvalContribution;
        uint256 disapprovalContribution;
        uint256 startTime;
        uint256 endTime;
        State state;
    }
    Usage[] private usages;

    event ContributionReceived(address contributor, uint amount, uint currentBalance);
    event CreatorPaid(address recipient);

    modifier isCreator(){
        require(creator == msg.sender, "Not Creator");
        _;
    }

    modifier notCreator(){
        require(creator != msg.sender, "Is Creator");
        _;
    }

    modifier isContributor(){
        require(contributions[msg.sender] > 0, "Not Contributor");
        _;
    }

    modifier inState(State _state){
        require(state == _state, "Invalid State");
        _;
    }

    modifier beforeDeadline(){
        require(block.timestamp < deadline, "Funding Expired");
        _;
    }

    modifier hasContribution(){
        require(msg.value > 0, "Invalid Contribution");
        _;
    }

    modifier hasEnoughBalance(uint256 _amount){
        require(_amount <= balance, "Not Enough Balance");
        _;
    }

    modifier usageInState(State _state, uint256 usageId){
        require(usages[usageId].state == _state, "Invalid Usage State");
        _;
    }

    constructor
    (
        address payable projectCreator,
        string memory projectTitle,
        string memory projectDescription,
        uint256 projectTarget,
        uint256 projectStartTime,
        uint256 projectDeadline
    ) public {
        creator = projectCreator;
        title = projectTitle;
        description = projectDescription;
        target = projectTarget;
        startTime = projectStartTime;
        deadline = projectDeadline;
    }

    function contribute() external payable notCreator() inState(State.Ongoing) beforeDeadline() hasContribution() {
        contributors.push(msg.sender);
        contributions[msg.sender] += msg.value;
        balance += msg.value;
        total += msg.value;
        emit ContributionReceived(msg.sender, msg.value, balance);
        checkRaisingState();
    }

    function createUsage(
        string calldata usageTitle,
        string calldata usageDescription,
        uint256 usageAmount
    ) external isCreator() inState(State.Succeeded) hasEnoughBalance(usageAmount) {
        uint256 usageStartTime = block.timestamp;
        Usage memory newUsage = Usage(usageTitle, usageDescription, usageAmount, 0, 0, usageStartTime, 0, State.Ongoing);
        usages.push(newUsage);
        balance -= usageAmount;
        checkUsingState();
    }

    function vote(
        bool approve,
        uint256 usageId
    ) external isContributor() inState(State.Succeeded) usageInState(State.Ongoing, usageId) {
        if(approve){
            usages[usageId].approvalContribution += contributions[msg.sender];
        }else{
            usages[usageId].disapprovalContribution += contributions[msg.sender];
        }
        checkUsageState(usageId);
    }

    function getDetail() external view returns(
        address payable projectCreator,
        string memory projectTitle,
        string memory projectDescription,
        uint256 projectTarget,
        uint256 projectStartTime,
        uint256 projectDeadline,
        uint256 projectCompleteTime,
        uint256 projectEndTime,
        uint256 projectBalance,
        uint256 projectTotal,
        uint256 projectContribution,
        State projectState
    ) {
        return (
            creator, title, description, target, startTime, deadline, 
            completeTime, endTime, balance, total, contributions[msg.sender], state
        );
    }

    function getUsageNum() external view returns(uint256) {
        return usages.length;
    }

    function getUsageDetail(uint256 usageId) external view returns(
        string memory usageTitle,
        string memory usageDescription,
        uint256 usageAmount,
        uint256 usageApprovalContribution,
        uint256 usageDisapprovalContribution,
        uint256 usageStartTime,
        uint256 usageEndTime,
        State usageState
    ) {
        Usage memory usage = usages[usageId];
        return (
            usage.title, usage.description, usage.amount, usage.approvalContribution,
            usage.disapprovalContribution, usage.startTime, usage.endTime, usage.state
        );
    }

    function checkRaisingState() private {
        if (balance >= target) {
            state = State.Succeeded;
            completeTime = block.timestamp;
        } else if (block.timestamp > deadline) {
            state = State.Failed;
            completeTime = block.timestamp;
            refund();
            endTime = block.timestamp;
        }
    }

    function checkUsingState() private {
        if (balance == 0) {
            state = State.Paidoff;
            endTime = block.timestamp;
        }
    }

    function checkUsageState(uint256 usageId) private {
        if(2 * usages[usageId].approvalContribution >= total){
            usages[usageId].state = State.Paidoff;
            pay(usageId);
            usages[usageId].endTime = block.timestamp;
        }
        else if(2 * usages[usageId].disapprovalContribution > total){
            usages[usageId].state = State.Failed;
            balance += usages[usageId].amount;
            usages[usageId].endTime = block.timestamp;
        }
    }

    function pay(uint256 usageId) private {
        creator.transfer(usages[usageId].amount);
    }

    function refund() private {
        for(uint256 i=0; i<contributors.length; i++){
            contributors[i].transfer(contributions[address(contributors[i])]);
        }
    }
}
