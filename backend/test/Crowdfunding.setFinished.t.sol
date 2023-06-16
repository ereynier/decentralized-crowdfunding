//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import {HelperCrowdfunding} from "./HelperCrowdfunding.t.sol";

contract CrowdfundingSetFinishedTest is Test, HelperCrowdfunding {
    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testSetFinished() public {
        bool isClosed;
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        (,,,,,, isClosed,) = crowdfunding.getProject(0);
        assertFalse(isClosed);
        crowdfunding.setFinished(0);
        (,,,,,, isClosed,) = crowdfunding.getProject(0);
        assertTrue(isClosed);

        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        (,,,,,, isClosed,) = crowdfunding.getProject(1);
        assertFalse(isClosed);
        skip(3 hours);
        vm.prank(address(1));
        crowdfunding.setFinished(1);
        (,,,,,, isClosed,) = crowdfunding.getProject(1);
    }

    function test_RevertIf_ProjectNotExist() public {
        vm.expectRevert("Project does not exist");
        crowdfunding.setFinished(0);

        crowdfunding.createProject("name", "desc", 10, 2 hours);
        vm.expectRevert("Project does not exist");
        crowdfunding.setFinished(1);
    }

    function test_RevertIf_NotProjectOwner() public {
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        vm.expectRevert("Only owner can set project as finished or deadline must be passed");
        vm.prank(address(1));
        crowdfunding.setFinished(0);
    }

    function test_RevertIf_ProjectAlreadyClosed() public {
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        crowdfunding.setFinished(0);
        vm.expectRevert("Project is already closed");
        crowdfunding.setFinished(0);
    }

    function test_RevertIf_NotProjectOwnerAndDeadlineNotReached() public {
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        vm.expectRevert("Only owner can set project as finished or deadline must be passed");
        vm.prank(address(1));
        crowdfunding.setFinished(0);
    }

    function testSetFinishedEmitsProjectFinished() public {
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        vm.expectEmit();
        emit ProjectFinished(0);
        crowdfunding.setFinished(0);
    }
}
