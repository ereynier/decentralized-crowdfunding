//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import { HelperCrowdfunding } from "./HelperCrowdfunding.t.sol";

contract CrowdfundingCreateProjectTest is Test, HelperCrowdfunding {

    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }


    function testCreateProject() public {
        assertEq(crowdfunding.getProjectsCount(), 0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsCount(), 1);
        (string memory name, string memory description, uint256 goal, uint256 deadline, uint256 amountRaised, address owner, bool isClosed) = crowdfunding.getProject(0);
        assertEq(name, "name");
        assertEq(description, "description");
        assertEq(goal, 100e18);
        assertGe(deadline, block.timestamp + 2 hours - 5);
        assertLe(deadline, block.timestamp + 2 hours);
        assertEq(amountRaised, 0);
        assertEq(owner, address(this));
        assertFalse(isClosed);
    }
}