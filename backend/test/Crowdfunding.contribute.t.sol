//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import { HelperCrowdfunding } from "./HelperCrowdfunding.t.sol";

contract CrowdfundingContributeTest is Test, HelperCrowdfunding {

    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testContribute() public {
        uint256 amountRaised;
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsByOwner(address(this)).length, 1);
        (,,,, amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 0);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 0);
        crowdfunding.contribute{value: 1 ether}(0);
        (,,,, amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 1e18);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 1e18);
        crowdfunding.contribute{value: 1 ether}(0);
        (,,,, amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 2e18);
        crowdfunding.contribute{value: 1 ether}(0);
        (,,,, amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 3e18);
    }

    function test_RevertIf_ValueIsZero() public {
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        vm.expectRevert("Contribution must be greater than 0");
        crowdfunding.contribute{value: 0}(0);
    }

    function test_RevertIf_ProjectNotExisting() public {
        vm.expectRevert("Project does not exist");
        crowdfunding.contribute{value: 1 ether}(0);

        crowdfunding.createProject("name", "desc", 10, 2 hours);
        vm.expectRevert("Project does not exist");
        crowdfunding.contribute{value: 1 ether}(1);
    }

    function test_RevertIf_ContributeAfterDeadline() public {
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        skip(3 hours);
        vm.expectRevert("Project is closed");
        crowdfunding.contribute{value: 1 ether}(0);
    }

    function test_RevertIf_ProjectIsClosed() public {
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        crowdfunding.setFinished(0);
        vm.expectRevert("Project is closed");
        crowdfunding.contribute{value: 1 ether}(0);
    }

    function testContributeEmitsContribution() public {
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        vm.expectEmit();
        emit Contribution(0, address(this), 1e18);
        crowdfunding.contribute{value: 1 ether}(0);
    }

}