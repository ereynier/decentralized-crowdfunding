//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import { HelperCrowdfunding } from "./HelperCrowdfunding.t.sol";

contract CrowdfundingOwnerWithdrawTest is Test, HelperCrowdfunding {

    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testOwnerWithdraw() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        crowdfunding.setFee(10);
        crowdfunding.contribute{value: 2 ether}(0);
        crowdfunding.setFinished(0);
        uint256 balanceBefore = address(this).balance;
        crowdfunding.ownerWithdraw();
        assertEq(address(this).balance, balanceBefore + 2e16);
    }
}