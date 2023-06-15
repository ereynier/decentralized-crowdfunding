//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import { HelperCrowdfunding } from "./HelperCrowdfunding.t.sol";

contract CrowdfundingOwnerWithdrawTest is Test, HelperCrowdfunding {

    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testOwnerWithdraw() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        crowdfunding.setFee(10);
        crowdfunding.contribute{value: 2 ether}(0);
        crowdfunding.setFinished(0);
        uint256 balanceBefore = address(this).balance;
        crowdfunding.ownerWithdraw();
        assertEq(address(this).balance, balanceBefore + 2e16);
    }

    function test_RevertIf_NotOwner() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        crowdfunding.setFee(10);
        crowdfunding.contribute{value: 2 ether}(0);
        crowdfunding.setFinished(0);
        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(address(1));
        crowdfunding.ownerWithdraw();
    }

    function test_RevertIf_NoFee() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        crowdfunding.setFee(0);
        crowdfunding.contribute{value: 2 ether}(0);
        crowdfunding.setFinished(0);
        vm.expectRevert("No fee to withdraw");
        crowdfunding.ownerWithdraw();
    }

    function testOwnerWithdrawEmitsOwnerWithdraw() public {
        crowdfunding.createProject("name", "description", 2e18, 2 hours);
        crowdfunding.setFee(10);
        crowdfunding.contribute{value: 2 ether}(0);
        crowdfunding.setFinished(0);
        vm.expectEmit();
        emit OwnerWithdraw(2e16);
        crowdfunding.ownerWithdraw();
    }
}