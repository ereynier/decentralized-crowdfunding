//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import {HelperCrowdfunding} from "./HelperCrowdfunding.t.sol";

contract CrowdfundingGetProjectsCountTest is Test, HelperCrowdfunding {
    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testGetProjectsCount() public {
        assertEq(crowdfunding.getProjectsCount(), 0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsCount(), 1);
        crowdfunding.setFinished(0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsCount(), 2);
        vm.prank(address(0));
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsCount(), 3);
    }

    function testFuzz_GetProjectsCount(uint x) public {
        vm.assume(x < 100);
        for (uint i = 0; i < x; i++) {
            crowdfunding.createProject("name", "description", 100e18, 2 hours);
            crowdfunding.setFinished(i);
        }
        assertEq(crowdfunding.getProjectsCount(), x);
    }

}
