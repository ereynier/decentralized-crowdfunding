//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import {HelperCrowdfunding} from "./HelperCrowdfunding.t.sol";

contract CrowdfundingFallbackTest is Test, HelperCrowdfunding {
    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testFallback() public {
        (bool success,) = address(crowdfunding).call{value: 1 ether}("");
        assertTrue(success);
        assertEq(crowdfunding.feeBalance(), 1 ether);
    }

    function test_RevertIf_FunctionNotExist() public {
        vm.expectRevert("Invalid function");
        (bool success,) = payable(address(crowdfunding)).call{value: 1 ether}(abi.encodeWithSignature("test()"));
        assertTrue(success);
    }
}
