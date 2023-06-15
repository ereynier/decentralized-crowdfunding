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

    function testGetProjectsByOwner() public {
        assertEq(crowdfunding.getProjectsByOwner(address(0)).length, 0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsByOwner(address(this)).length, 1);
        assertEq(crowdfunding.getProjectsByOwner(address(this))[0], 0);
        vm.startPrank(address(1));
        assertEq(crowdfunding.getProjectsByOwner(address(0)).length, 0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsByOwner(address(1)).length, 1);
        assertEq(crowdfunding.getProjectsByOwner(address(1))[0], 1);
    }
}