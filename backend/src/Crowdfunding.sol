//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Crowdfunding is Ownable, ReentrancyGuard {

    // EVENTS

    event ProjectCreated(uint256 indexed projectId);
    event ProjectFinished(uint256 indexed projectId);
    event Contribution(uint256 indexed projectId, address indexed contributor, uint256 amount);
    event Refund(uint256 indexed projectId, address indexed contributor, uint256 amount);
    event Withdraw(uint256 indexed projectId, address indexed owner, uint256 amount);
    event FeeSet(uint256 fee);
    event OwnerWithdraw(uint256 amount);
    event Received(address indexed sender, uint256 amount);

    // STRUCTS

    struct Project {
        string name;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        address payable owner;
        bool isClosed;
        bool goalReached;
    }

    // GLOBAL VAR

    uint256 public fee;

    uint256 public constant DENOMINATOR = 1000;

    uint256 public immutable MAX_FEE;

    uint256 public feeBalance;

    Project[] public projects;

    mapping(address => uint256[]) public projectsByOwner;

    mapping(address => mapping(uint256 => uint256)) public contributionsByProject;
    
    // CONSTRUCTOR

    constructor(uint256 _maxFee) {
        MAX_FEE = _maxFee;
    }

    // FUNCTIONS

    // getters

    function getProjectsCount() public view returns (uint256) {
        return projects.length;
    }

    function getProjectsByOwner(address _owner) public view returns (uint256[] memory) {
        return projectsByOwner[_owner];
    }

    function getProject(uint256 _projectId) external view returns (string memory name, string memory description, uint256 goal, uint256 deadline, uint256 amountRaised, address owner, bool isClosed, bool goalReached) {
        require(_projectId < projects.length, "Project does not exist");
        return (projects[_projectId].name, projects[_projectId].description, projects[_projectId].goal, projects[_projectId].deadline, projects[_projectId].amountRaised, projects[_projectId].owner, projects[_projectId].isClosed, projects[_projectId].goalReached);
    }

    function getContribution(address _contributor, uint256 _projectId) external view returns (uint256) {
        require(_projectId < projects.length, "Project does not exist");
        return contributionsByProject[_contributor][_projectId];
    }

    // setters

    function setFee(uint256 _fee) public onlyOwner {
        require(_fee <= MAX_FEE, "Fee must be less than or equal to max fee");
        fee = _fee;
        emit FeeSet(_fee);
    }

    // project functions

    function createProject(string memory _name, string memory _description, uint256 _goal, uint256 _deadline) public returns(uint256) {
        require(_goal > 0, "Goal must be greater than 0");
        require(_deadline >= 1 minutes, "Deadline must be at least in 1 minute");
        require(projectsByOwner[msg.sender].length == 0 || projects[projectsByOwner[msg.sender][projectsByOwner[msg.sender].length - 1]].isClosed, "Users can only create one project at a time");
        projects.push(Project(_name, _description, _goal, block.timestamp + _deadline, 0, payable(msg.sender), false, false));
        projectsByOwner[msg.sender].push(projects.length - 1);
        emit ProjectCreated(projects.length - 1);
        return (projects.length - 1);
    }

    function contribute(uint256 _projectId) public payable {
        require(msg.value > 0, "Contribution must be greater than 0");
        require(_projectId < projects.length, "Project does not exist");
        require(projects[_projectId].deadline >= block.timestamp, "Project deadline is passed");
        require(!projects[_projectId].isClosed, "Project is closed");

        // Take the fees
        uint256 feeAmount = (msg.value * fee) / DENOMINATOR;
        feeBalance += feeAmount;

        // Send the rest to the project owner
        projects[_projectId].amountRaised += msg.value - feeAmount;
        if (projects[_projectId].amountRaised >= projects[_projectId].goal) {
            projects[_projectId].goalReached = true;
        }

        // update contributors
        contributionsByProject[msg.sender][_projectId] += msg.value - feeAmount;
        emit Contribution(_projectId, msg.sender, msg.value - feeAmount);
    }

    function refund(uint256 _projectId) public nonReentrant() {
        require(_projectId < projects.length, "Project does not exist");
        require(projects[_projectId].isClosed, "Project is not closed");
        require(!projects[_projectId].goalReached, "Project goal is reached");
        require(contributionsByProject[msg.sender][_projectId] > 0, "No contribution found");
        uint256 amount = contributionsByProject[msg.sender][_projectId];
        contributionsByProject[msg.sender][_projectId] = 0;

        // safeTransfer
        (bool success, ) = address(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit Refund(_projectId, msg.sender, amount);
    }

    function withdraw(uint256 _projectId) public nonReentrant {
        require(_projectId < projects.length, "Project does not exist");
        require(projects[_projectId].isClosed, "Project is not closed");
        require(msg.sender == projects[_projectId].owner, "Only owner can withdraw");
        require(projects[_projectId].amountRaised > 0, "No amount to withdraw");
        require(projects[_projectId].goalReached, "Project goal is not reached");
        uint256 amount = projects[_projectId].amountRaised;
        projects[_projectId].amountRaised = 0;

        // safeTransfer
        (bool success, ) = address(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdraw(_projectId, msg.sender, amount);
    }

    function setFinished(uint256 _projectId) public {
        require(_projectId < projects.length, "Project does not exist");
        require(msg.sender == projects[_projectId].owner || projects[_projectId].deadline < block.timestamp, "Only owner can set project as finished or deadline must be passed");
        require(!projects[_projectId].isClosed, "Project is already closed");
        projects[_projectId].isClosed = true;
        emit ProjectFinished(_projectId);
    }

    // owner functions

    function ownerWithdraw() public onlyOwner nonReentrant {
        require(feeBalance > 0, "No fee to withdraw");
        uint256 amount = feeBalance;
        feeBalance = 0;

        // safeTransfer
        (bool success, ) = address(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit OwnerWithdraw(amount);
    }

    // receive / fallback

    receive() external payable {
        feeBalance += msg.value;
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        require(msg.data.length == 0, "Invalid function");
    }

}