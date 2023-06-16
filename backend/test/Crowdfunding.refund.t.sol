//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import {HelperCrowdfunding} from "./HelperCrowdfunding.t.sol";

contract CrowdfundingRefundTest is Test, HelperCrowdfunding {
    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testRefund() public {
        crowdfunding.createProject("name", "description", 5e18, 2 hours);
        crowdfunding.contribute{value: 1 ether}(0);
        crowdfunding.setFinished(0);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 1e18);
        uint256 balanceBefore = address(this).balance;
        crowdfunding.refund(0);
        assertEq(address(this).balance, balanceBefore + 1e18);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 0);
    }

    function test_RvertIf_ProjectNotExist() public {
        vm.expectRevert("Project does not exist");
        crowdfunding.refund(0);

        crowdfunding.createProject("name", "desc", 10, 2 hours);
        vm.expectRevert("Project does not exist");
        crowdfunding.refund(1);
    }

    function test_RevertIf_ProjectNotClosed() public {
        crowdfunding.createProject("name", "description", 5e18, 2 hours);
        crowdfunding.contribute{value: 1 ether}(0);
        vm.expectRevert("Project is not closed");
        crowdfunding.refund(0);
    }

    function test_RevertIf_GoalReached() public {
        crowdfunding.createProject("name", "description", 5e18, 2 hours);
        crowdfunding.contribute{value: 5 ether}(0);
        crowdfunding.setFinished(0);
        vm.expectRevert("Project goal is reached");
        crowdfunding.refund(0);
    }

    function test_RevertIf_NotContributed() public {
        crowdfunding.createProject("name", "description", 5e18, 2 hours);
        crowdfunding.setFinished(0);
        vm.expectRevert("No contribution found");
        crowdfunding.refund(0);
    }

    function test_RevertIf_Withdrawn() public {
        crowdfunding.createProject("name", "description", 1e18, 2 hours);
        crowdfunding.contribute{value: 3 ether}(0);
        crowdfunding.setFinished(0);
        crowdfunding.withdraw(0);
        vm.expectRevert("No amount to refund");
        crowdfunding.refund(0);
    }

    function testRefundEmitsRefund() public {
        crowdfunding.createProject("name", "description", 5e18, 2 hours);
        crowdfunding.contribute{value: 1 ether}(0);
        crowdfunding.setFinished(0);
        vm.expectEmit();
        emit Refund(0, address(this), 1e18);
        crowdfunding.refund(0);
    }

    function testFuzz_Refund(uint x) public {
        x = bound(x, 1, 1000);
        crowdfunding.createProject("name", "description", 10000e18, 2 hours);
        crowdfunding.contribute{value: x * 1 ether}(0);
        crowdfunding.setFinished(0);
        uint256 balanceBefore = address(this).balance;
        vm.expectEmit();
        emit Refund(0, address(this), x * 1e18);
        crowdfunding.refund(0);
        assertEq(address(this).balance, balanceBefore + x * 1e18);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 0);
    }

    function testFuzz_RefundWithFees(uint fee, uint x) public {
        fee = bound(fee, 1, crowdfunding.MAX_FEE());
        x = bound(x, 1, 1000);
        crowdfunding.createProject("name", "description", x * 5e18, 2 hours);
        crowdfunding.setFee(fee);
        crowdfunding.contribute{value: x * 1 ether}(0);
        deal(address(1), 1 ether);
        vm.prank(address(1));
        crowdfunding.contribute{value: 1 ether}(0);
        crowdfunding.setFinished(0);
        uint256 balanceBefore = address(this).balance;
        vm.expectEmit();
        emit Refund(0, address(this), x * 1e18 - (fee * (x * 1e18) / crowdfunding.DENOMINATOR()));
        crowdfunding.refund(0);
        assertEq(address(this).balance, balanceBefore + x * 1e18 - (fee * (x * 1e18) / crowdfunding.DENOMINATOR()));
    }
}
