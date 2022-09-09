// Here we are gonna define our own priceFeedAggregator Our self
// to test locally
// we often want to import some contracts that are not gonna be using our version of solidity so we're gonna fix it in hardhat.config

// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol";

//importing like this is  exactly similar to copy pasting that exact complete MockV3Aggregator.sol code from chainlink repo
