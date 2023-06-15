//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import { HelperCrowdfunding } from "./HelperCrowdfunding.t.sol";

contract CrowdfundingWithdrawTest is Test, HelperCrowdfunding {

    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testWithdraw() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        crowdfunding.contribute{value: 2 ether}(0);
        uint256 balanceBefore = address(this).balance;
        crowdfunding.setFinished(0);
        crowdfunding.withdraw(0);
        assertEq(address(this).balance, balanceBefore + 2e18);
        (,,,,uint256 amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 0);
    }
}