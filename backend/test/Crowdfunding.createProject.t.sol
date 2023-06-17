//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import {HelperCrowdfunding} from "./HelperCrowdfunding.t.sol";

contract CrowdfundingCreateProjectTest is Test, HelperCrowdfunding {
    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testCreateProject() public {
        assertEq(crowdfunding.getProjectsCount(), 0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsCount(), 1);
        (
            string memory name,
            string memory description,
            uint256 goal,
            uint256 deadline,
            uint256 amountRaised,
            address owner,
            bool isClosed,
            bool goalReached
        ) = crowdfunding.getProject(0);
        assertEq(name, "name");
        assertEq(description, "description");
        assertEq(goal, 100e18);
        assertGe(deadline, block.timestamp + 2 hours - 5);
        assertLe(deadline, block.timestamp + 2 hours);
        assertEq(amountRaised, 0);
        assertEq(owner, address(this));
        assertFalse(isClosed);

        crowdfunding.setFinished(0);
        skip(10 hours);

        crowdfunding.createProject("2", "2", 100e18, 4 hours);
        assertEq(crowdfunding.getProjectsCount(), 2);
        (name, description, goal, deadline, amountRaised, owner, isClosed, goalReached) = crowdfunding.getProject(1);
        assertEq(name, "2");
        assertEq(description, "2");
        assertEq(goal, 100e18);
        assertGe(deadline, block.timestamp + 4 hours - 5);
        assertLe(deadline, block.timestamp + 4 hours);
        assertEq(amountRaised, 0);
        assertEq(owner, address(this));
        assertFalse(isClosed);

        vm.prank(address(1));
        crowdfunding.createProject("1", "1", 15e18, 5 hours);
        assertEq(crowdfunding.getProjectsCount(), 3);
        (name, description, goal, deadline, amountRaised, owner, isClosed, goalReached) = crowdfunding.getProject(2);
        assertEq(name, "1");
        assertEq(description, "1");
        assertEq(goal, 15e18);
        assertGe(deadline, block.timestamp + 5 hours - 5);
        assertLe(deadline, block.timestamp + 5 hours);
        assertEq(amountRaised, 0);
        assertEq(owner, address(1));
        assertFalse(isClosed);
    }

    function test_RevertIf_GoalIsZero() public {
        vm.expectRevert("Goal must be greater than 0");
        crowdfunding.createProject("name", "description", 0, 2 hours);
    }

    function test_RevertIf_DeadlineUnderMin() public {
        vm.expectRevert("Deadline must be at least in 1 minute");
        crowdfunding.createProject("name", "description", 100e18, 1 minutes - 1 seconds);
    }

    function test_RevertIf_UserHasActiveProject() public {
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        vm.expectRevert("Users can only create one project at a time");
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
    }

    function testCreateProjectEmitsProjectCreated() public {
        vm.expectEmit();
        emit ProjectCreated(0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);

        vm.expectEmit();
        emit ProjectCreated(1);
        vm.prank(address(1));
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
    }
}
