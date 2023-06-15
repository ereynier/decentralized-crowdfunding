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

    function testSetFee() public {
        assertEq(crowdfunding.fee(), 0);
        crowdfunding.setFee(1);
        assertEq(crowdfunding.fee(), 1);
        crowdfunding.setFee(100);
        assertEq(crowdfunding.fee(), 100);
    }
}