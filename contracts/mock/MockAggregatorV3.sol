// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

abstract contract MockAggregatorV3 is AggregatorV3Interface {
    uint8 public override decimals;
    int256 private answer;

    constructor() {
        decimals = 10;
        answer = 20000000000;
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        return (0, answer, 0, 0, 0);
    }

    function updateAnswer(int256 _newAnswer) public {
        answer = _newAnswer;
    }

    function description() external pure override returns (string memory) {
        return "MockV3Aggregator";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }
}
