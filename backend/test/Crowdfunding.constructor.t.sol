//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Crowdfunding.sol";
import {HelperCrowdfunding} from "./HelperCrowdfunding.t.sol";

contract CrowdfundingConstructorTest is Test, HelperCrowdfunding {
    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding(100);
    }

    function testConstructor() public {
        assertEq(crowdfunding.MAX_FEE(), 100);
    }

    function testFuzz_Constructor(uint x) public {
        x = bound(x, 0, 1000);
        Crowdfunding cr = new Crowdfunding(x);
        assertEq(cr.MAX_FEE(), x);
    }
}
