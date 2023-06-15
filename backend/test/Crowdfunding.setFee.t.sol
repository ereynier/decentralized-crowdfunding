//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import { HelperCrowdfunding } from "./HelperCrowdfunding.t.sol";

contract CrowdfundingSetFeeTest is Test, HelperCrowdfunding {

    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testSetFee() public {
        assertEq(crowdfunding.fee(), 0);
        crowdfunding.setFee(1);
        assertEq(crowdfunding.fee(), 1);
        crowdfunding.setFee(100);
        assertEq(crowdfunding.fee(), 100);
    }

    function test_RevertIf_SetFeeOverMax() public {
        vm.expectRevert("Fee must be less than or equal to max fee");
        crowdfunding.setFee(101);
    }

    function test_RevertIf_NotOwner() public {
        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(address(1));
        crowdfunding.setFee(1);
    }

    function testSetFeeEmitsFeeSet() public {
        vm.expectEmit();
        emit FeeSet(1);
        crowdfunding.setFee(1);
    }
}