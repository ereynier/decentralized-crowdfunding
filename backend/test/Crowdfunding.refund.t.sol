//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import { HelperCrowdfunding } from "./HelperCrowdfunding.t.sol";

contract CrowdfundingRefundTest is Test, HelperCrowdfunding {

    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testRefund() public {
        crowdfunding.createProject("name", "description", 5e18, 2 hours);
        crowdfunding.contribute{value: 1 ether}(0);
        crowdfunding.setFinished(0);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 1e18);
        uint balanceBefore = address(this).balance;
        crowdfunding.refund(0);
        assertEq(address(this).balance, balanceBefore + 1e18);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 0);

    }
}