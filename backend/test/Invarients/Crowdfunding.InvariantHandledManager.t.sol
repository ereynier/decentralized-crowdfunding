//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import { Crowdfunding } from "../../src/Crowdfunding.sol";


import { CommonBase } from "forge-std/Base.sol";
import { StdCheats } from "forge-std/StdCheats.sol";
import  { StdUtils } from "forge-std/StdUtils.sol";

contract Handler is CommonBase, StdCheats, StdUtils {
    Crowdfunding private crowdfunding;

    uint256 public deposit;

    constructor(Crowdfunding _crowdfunding) {
        crowdfunding = _crowdfunding;
    }

    receive() external payable {}

    function contribute(uint256 projectId, uint amount) public payable {
        amount = bound(amount, 1, address(this).balance / 10);
        if (crowdfunding.getProjectsCount() == 0) { return; }
        projectId = bound(projectId, 0, crowdfunding.getProjectsCount() - 1);
        (,,,uint deadline,,,bool isClosed) = crowdfunding.getProject(projectId);
        if (deadline < block.timestamp) { return; }
        if (isClosed) { return; }
        deposit += amount;
        crowdfunding.contribute{value:amount}(projectId);
    }

    function withdraw(uint256 projectId) public {
        if (crowdfunding.getProjectsCount() == 0) { return; }
        projectId = bound(projectId, 0, crowdfunding.getProjectsCount() - 1);
        (,,uint256 goal,,uint256 amountRaised,address owner,bool isClosed) = crowdfunding.getProject(projectId);
        if (!isClosed) { return; }
        if (owner != address(this)) { return; }
        if (amountRaised == 0) { return; }
        if (amountRaised < goal) { return; }
        deposit -= amountRaised;
        crowdfunding.withdraw(projectId);
    }

    function refund(uint256 projectId) public {
        if (crowdfunding.getProjectsCount() == 0) { return; }
        projectId = bound(projectId, 0, crowdfunding.getProjectsCount() - 1);
        (,,uint256 goal,,,,bool isClosed) = crowdfunding.getProject(projectId);
        uint256 amount = crowdfunding.getContribution(address(this), projectId);
        if (amount == 0) { return; }
        if (!isClosed) { return; }
        if (amount >= goal) { return; }
        deposit -= amount;
        crowdfunding.refund(projectId);
    }

    function setFinished(uint256 projectId) public {
        if (crowdfunding.getProjectsCount() == 0) { return; }
        projectId = bound(projectId, 0, crowdfunding.getProjectsCount() - 1);
        (,,,uint256 deadline,,address owner,bool isClosed) = crowdfunding.getProject(projectId);
        if (owner != address(this) && deadline > block.timestamp) { return; }
        if (isClosed) { return; }
        crowdfunding.setFinished(projectId);
    }

    function setFee(uint256 fee) public {
        fee = bound(fee, 0, crowdfunding.MAX_FEE());
        if (crowdfunding.owner() != address(this)) { return; }
        crowdfunding.setFee(fee);
    }

    function ownerWithdraw() public {
        if (crowdfunding.owner() != address(this)) { return; }
        if (crowdfunding.feeBalance() == 0) { return; }
        crowdfunding.ownerWithdraw();
    }

    function createProject(string memory name, string memory description, uint256 goal, uint256 deadline) public {
        uint projectNb = crowdfunding.getProjectsByOwner(address(this)).length;
        if (projectNb > 0) {
            uint projectId = crowdfunding.getProjectsByOwner(address(this))[projectNb - 1];
            (,,,,,,bool isClosed) = crowdfunding.getProject(projectId);
            if (!isClosed) { return; }
        }
        deadline = bound(deadline, 1 hours, 100 hours);
        goal = bound(goal, 1, 100 ether);
        crowdfunding.createProject(name, description, goal, deadline);
    }

    function timeTravel() public {
        skip(1 hours);
    }

}

contract Crowdfunding_HandlerBasedInvariant_Test is Test {
    Crowdfunding public crowdfunding;
    Handler public handler;

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
        handler = new Handler(crowdfunding);

        deal(address(handler), 100 * 1 ether);
        targetContract(address(handler));
        bytes4[] memory selectors = new bytes4[](8);
        selectors[0] = handler.contribute.selector;
        selectors[1] = handler.withdraw.selector;
        selectors[2] = handler.refund.selector;
        selectors[3] = handler.setFinished.selector;
        selectors[4] = handler.setFee.selector;
        selectors[5] = handler.ownerWithdraw.selector;
        selectors[6] = handler.createProject.selector;
        selectors[7] = handler.timeTravel.selector;
        targetSelector(
            FuzzSelector({addr: address(handler), selectors: selectors})
        );
    }

    function invariant_Crowdfunding_Balance() public {
        assertGe(address(crowdfunding).balance, handler.deposit());
    }
}