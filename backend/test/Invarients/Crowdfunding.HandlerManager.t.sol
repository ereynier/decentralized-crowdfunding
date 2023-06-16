//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import { Crowdfunding } from "../../src/Crowdfunding.sol";
import { Handler } from "./Crowdfunding.InvariantHandled.t.sol";

import { CommonBase } from "forge-std/Base.sol";
import { StdCheats } from "forge-std/StdCheats.sol";
import  { StdUtils } from "forge-std/StdUtils.sol";

contract ActorManager is CommonBase, StdCheats, StdUtils {
    Handler[] public handlers;

    constructor(Handler[] memory _handlers) {
        handlers = _handlers;
    }

    function contribute(uint handlerIndex, uint256 projectId, uint amount) public payable {
        uint index = bound(handlerIndex, 0, handlers.length - 1);
        handlers[index].contribute(projectId, amount);
    }

    function withdraw(uint handlerIndex, uint256 projectId) public {
        uint index = bound(handlerIndex, 0, handlers.length - 1);
        handlers[index].withdraw(projectId);
    }

    function refund(uint handlerIndex, uint256 projectId) public {
        uint index = bound(handlerIndex, 0, handlers.length - 1);
        handlers[index].refund(projectId);
    }

    function setFinished(uint handlerIndex, uint256 projectId) public {
        uint index = bound(handlerIndex, 0, handlers.length - 1);
        handlers[index].setFinished(projectId);
    }

    function setFee(uint handlerIndex, uint256 fee) public {
        uint index = bound(handlerIndex, 0, handlers.length - 1);
        handlers[index].setFee(fee);
    }

    function ownerWithdraw(uint handlerIndex) public {
        uint index = bound(handlerIndex, 0, handlers.length - 1);
        handlers[index].ownerWithdraw();
    }

    function createProject(uint handlerIndex, string memory name, string memory description, uint256 goal, uint256 deadline) public {
        uint index = bound(handlerIndex, 0, handlers.length - 1);
        handlers[index].createProject(name, description, goal, deadline);
    }

    function timeTravel(uint handlerIndex) public {
        uint index = bound(handlerIndex, 0, handlers.length - 1);
        handlers[index].timeTravel();
    }
}

contract Crowdfunding_MultiHandlerInvariantTest is Test {
    Crowdfunding public crowdfunding;
    ActorManager public manager;
    Handler[] public handlers;

    function setUp() public {
        crowdfunding = new Crowdfunding(100);

        for (uint i = 0; i < 10; i++) {
            handlers.push(new Handler(crowdfunding));
            deal(address(handlers[i]), 100 * 1e18);
        }

        manager = new ActorManager(handlers);

        targetContract(address(manager));
    }

    function invariant_CrowdfundingBalance() public {
    //     uint total = 0;
    //     for (uint i = 0; i < handlers.length; i++) {
    //         total += handlers[i].deposit();
    //     }
    //     console.log("total: %s", total / 1e18);
    //     assertEq(address(crowdfunding).balance, total);
    }
}