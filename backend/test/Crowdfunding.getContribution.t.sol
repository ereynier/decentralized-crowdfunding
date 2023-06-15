//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import { HelperCrowdfunding } from "./HelperCrowdfunding.t.sol";

contract CrowdfundingGetContributionTest is Test, HelperCrowdfunding {

    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testGetContribution() public {
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 0);
        crowdfunding.contribute{value: 1 ether}(0);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 1e18);
        crowdfunding.contribute{value: 1 ether}(0);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 2e18);
        crowdfunding.contribute{value: 1 ether}(0);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 3e18);
        assertEq(crowdfunding.contributionsByProject(address(1), 0), 0);
        deal(address(1), 2 ether);
        vm.prank(address(1));
        crowdfunding.contribute{value: 1 ether}(0);
        assertEq(crowdfunding.contributionsByProject(address(1), 0), 1e18);
    }

    function test_RevertIf_ProjectNotExist() public {
        vm.expectRevert("Project does not exist");
        crowdfunding.getContribution(address(this), 0);
        crowdfunding.createProject("a", "b", 1, 2 hours);
        vm.expectRevert("Project does not exist");
        crowdfunding.getContribution(address(this), 1);
    }
}