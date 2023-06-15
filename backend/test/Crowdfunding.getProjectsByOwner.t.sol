//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import {HelperCrowdfunding} from "./HelperCrowdfunding.t.sol";

contract CrowdfundingGetProjectsByOwnerTest is Test, HelperCrowdfunding {
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

    function testFuzz_GetProjectsByOwner(uint x, uint y) public {
        vm.assume(x < 100);
        vm.assume(y < 100);
        for (uint i = 0; i < x; i++) {
            crowdfunding.createProject("name", "description", 100e18, 2 hours);
            crowdfunding.setFinished(i);
        }
        for (uint i = 0; i < y; i++) {
            vm.prank(address(1));
            crowdfunding.createProject("name", "description", 100e18, 2 hours);
            vm.prank(address(1));
            crowdfunding.setFinished(i + x);
        }
        assertEq(crowdfunding.getProjectsByOwner(address(this)).length, x);
        assertEq(crowdfunding.getProjectsByOwner(address(1)).length, y);
    }

}
