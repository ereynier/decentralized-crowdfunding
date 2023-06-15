//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";

contract CrowdfundingTest is Test {
    Crowdfunding crowdfunding;

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
}