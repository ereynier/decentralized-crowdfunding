//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import {HelperCrowdfunding} from "./HelperCrowdfunding.t.sol";

contract CrowdfundingWithdrawTest is Test, HelperCrowdfunding {
    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testWithdraw() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        crowdfunding.contribute{value: 2 ether}(0);
        uint256 balanceBefore = address(this).balance;
        crowdfunding.setFinished(0);
        crowdfunding.withdraw(0);
        assertEq(address(this).balance, balanceBefore + 2e18);
        (,,,, uint256 amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 0);
    }

    function test_RevertIf_ProjectNotExist() public {
        vm.expectRevert("Project does not exist");
        crowdfunding.withdraw(0);

        crowdfunding.createProject("name", "desc", 10, 2 hours);
        vm.expectRevert("Project does not exist");
        crowdfunding.withdraw(1);
    }

    function test_RevertIf_NotProjectOwner() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        crowdfunding.contribute{value: 2 ether}(0);
        crowdfunding.setFinished(0);
        vm.expectRevert("Only owner can withdraw");
        vm.prank(address(1));
        crowdfunding.withdraw(0);
    }

    function test_RevertIf_ProjectNotClosed() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        vm.expectRevert("Project is not closed");
        crowdfunding.withdraw(0);
    }

    function test_RevertIf_NoAmountToWithdraw() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        crowdfunding.contribute{value: 3 ether}(0);
        crowdfunding.setFinished(0);
        crowdfunding.withdraw(0);
        vm.expectRevert("No amount to withdraw");
        crowdfunding.withdraw(0);
    }

    function test_RevertIf_GoalNotReached() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        crowdfunding.contribute{value: 1 ether}(0);
        crowdfunding.setFinished(0);
        vm.expectRevert("Project goal is not reached");
        crowdfunding.withdraw(0);
    }

    function testFuzz_Withdraw(uint x, uint y) public {
        x = bound(x, 1, 1000);
        y = bound(y, 1, 1000);
        vm.assume(x > y);
        crowdfunding.createProject("name", "description", y * 1e18, 2 hours);
        crowdfunding.contribute{value: x * 1 ether}(0);
        crowdfunding.setFinished(0);
        uint256 balanceBefore = address(this).balance;
        vm.expectEmit();
        emit Withdraw(0, address(this), x * 1e18);
        crowdfunding.withdraw(0);
        assertEq(address(this).balance, balanceBefore + x * 1e18);
        (,,,, uint256 amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 0);
    }

    function testFuzz_WithdrawWithFees(uint fee, uint x) public {
        fee = bound(fee, 1, crowdfunding.MAX_FEE());
        x = bound(x, 1, 1000);
        crowdfunding.createProject("name", "description", x * 1e12, 2 hours);
        crowdfunding.setFee(fee);
        crowdfunding.contribute{value: x * 1 ether}(0);
        crowdfunding.setFinished(0);
        uint256 balanceBefore = address(this).balance;
        vm.expectEmit();
        emit Withdraw(0, address(this), x * 1e18 - (fee * (x * 1e18) / crowdfunding.DENOMINATOR()));
        crowdfunding.withdraw(0);
        assertEq(address(this).balance, balanceBefore + x * 1e18 - (fee * (x * 1e18) / crowdfunding.DENOMINATOR()));
    }
}
