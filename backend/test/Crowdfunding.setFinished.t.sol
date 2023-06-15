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

    function testSetFinished() public {
        bool isClosed;
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        (,,,,,, isClosed) = crowdfunding.getProject(0);
        assertFalse(isClosed);
        crowdfunding.setFinished(0);
        (,,,,,, isClosed) = crowdfunding.getProject(0);
        assertTrue(isClosed);
    }
}