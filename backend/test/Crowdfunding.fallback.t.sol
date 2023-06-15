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

    function testFallback() public {
        (bool success,) = address(crowdfunding).call{value: 1 ether}("");
        assertTrue(success);
        assertEq(crowdfunding.feeBalance(), 1 ether);
    }
        // (success, ) = payable(address(crowdfunding)).call{value: 1 ether}(abi.encodeWithSignature("test()"));
        // assertTrue(success);
        // balanceBefore = address(this).balance;
        // crowdfunding.ownerWithdraw();
        // assertEq(address(this).balance, balanceBefore + 1 ether);
}