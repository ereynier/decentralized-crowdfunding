// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../src/Crowdfunding.sol";

abstract contract HelperCrowdfunding {
    event ProjectCreated(uint256 indexed projectId);
    event ProjectFinished(uint256 indexed projectId);
    event Contribution(uint256 indexed projectId, address indexed contributor, uint256 amount);
    event Refund(uint256 indexed projectId, address indexed contributor, uint256 amount);
    event Withdraw(uint256 indexed projectId, address indexed owner, uint256 amount);
    event FeeSet(uint256 fee);
    event OwnerWithdraw(uint256 amount);
    event Received(address indexed sender, uint256 amount);

    Crowdfunding crowdfunding;

    constructor() {}

}