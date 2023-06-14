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

    function testConstructor() public {
        assertEq(crowdfunding.MAX_FEE(), 100);
    }

    function testGetProjectsCount() public {
        assertEq(crowdfunding.getProjectsCount(), 0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsCount(), 1);
        crowdfunding.setFinished(0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsCount(), 2);
        vm.prank(address(0));
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsCount(), 3);
    }

    function testGetProjectsByOwner() public {
        assertEq(crowdfunding.getProjectsByOwner(address(0)).length, 0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsByOwner(address(this)).length, 1);
        assertEq(crowdfunding.getProjectsByOwner(address(this))[0], 0);
        vm.startPrank(address(1));
        assertEq(crowdfunding.getProjectsByOwner(address(0)).length, 0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsByOwner(address(1)).length, 1);
        assertEq(crowdfunding.getProjectsByOwner(address(1))[0], 1);
    }

    function testCreateProject() public {
        assertEq(crowdfunding.getProjectsCount(), 0);
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsCount(), 1);
        (string memory name, string memory description, uint256 goal, uint256 deadline, uint256 amountRaised, address owner, bool isClosed) = crowdfunding.getProject(0);
        assertEq(name, "name");
        assertEq(description, "description");
        assertEq(goal, 100e18);
        assertGe(deadline, block.timestamp + 2 hours - 5);
        assertLe(deadline, block.timestamp + 2 hours);
        assertEq(amountRaised, 0);
        assertEq(owner, address(this));
        assertFalse(isClosed);
    }

    function testContribute() public {
        uint256 amountRaised;
        crowdfunding.createProject("name", "description", 100e18, 2 hours);
        assertEq(crowdfunding.getProjectsByOwner(address(this)).length, 1);
        (,,,, amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 0);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 0);
        crowdfunding.contribute{value: 1 ether}(0);
        (,,,, amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 1e18);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 1e18);
        crowdfunding.contribute{value: 1 ether}(0);
        (,,,, amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 2e18);
        crowdfunding.contribute{value: 1 ether}(0);
        (,,,, amountRaised,,) = crowdfunding.getProject(0);
        assertEq(amountRaised, 3e18);
    }

    function testRefund() public {
        crowdfunding.createProject("name", "description", 5e18, 2 hours);
        crowdfunding.contribute{value: 1 ether}(0);
        crowdfunding.setFinished(0);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 1e18);
        uint balanceBefore = address(this).balance;
        crowdfunding.refund(0);
        assertEq(address(this).balance, balanceBefore + 1e18);
        assertEq(crowdfunding.contributionsByProject(address(this), 0), 0);

    }

    function testWithdraw() public {

    }

    function testSetFee() public {
        assertEq(crowdfunding.fee(), 0);
        crowdfunding.setFee(1);
        assertEq(crowdfunding.fee(), 1);
        crowdfunding.setFee(100);
        assertEq(crowdfunding.fee(), 100);
    }

    function testOwnerWithdraw() public {

    }

    function testReceive() public {

    }

    function testSetFinished() public {

    }


}