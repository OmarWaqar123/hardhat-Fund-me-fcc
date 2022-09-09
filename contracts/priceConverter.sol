//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library priceConverter {
    function getprice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        // ETH in terms of USD
        // 3000.00000000
        return uint256(price * 1e10); //  1**10 == 10000000000 => 3000.000000000000000000
    }

    //  .......................1st arg           ,  2ndArg
    function getConvertionRate(
        uint256 ethamount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethprice = getprice(priceFeed);
        uint256 ethamountInUSD = (ethprice * ethamount) / 1e18;
        return ethamountInUSD;
    }
}
