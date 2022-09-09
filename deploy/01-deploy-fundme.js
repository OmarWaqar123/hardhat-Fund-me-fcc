//* NORMALLY IN DEPLOY.JS */
// import
// main function
// calling of main function

// *IN NEW HARDHAT-DEPLOY*

//      hre means harhdat runtime enviroment
// function deployFunc(hre) {
//   console.log("Nothing here just learning");
// }
const { verify } = require("../Utils/verify");
const { network } = require("hardhat"); //for network in below hre function
// module.exports.default = deployFunc;
//            OR
module.exports = async (hre) => {
    //basically jese hum import krte hen uppeer javascript me usi tarha
    //yaha hre async function me argument he (aur jo ke  nearly = hardhat he) is se mukhtalif cheeze import krenge
    const { getNamedAccounts, deployments } = hre;
    // hre.getNamedAccounts
    //hre.deployments
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    //when going for localhost or hardhat network we want to use a mock
    // But what happens whenw we want to change chains meaning lets say we want to change chain from rinkeby
    // to ropsten but in our code we have various components which are designed for the previous chain which now are useless after changing the chain
    // like the AgrregatorV3Interface address in priceconverter.sol which is specifically for rinkeby.
    // so we fix it
    //..
    //..
    // so we learned that to deploy contract we need contract  factory but with this new  hardhat-deploy we can use deploy function
    // ..
    // ..
    // if chainId is X use address Y
    const {
        networkConfig,
        developmentChains,
    } = require("../helper-hardhat-config");
    // mock contracts idea = if the contract doesn't exist,we deploy a minimal version of it for ourlocal testing
    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // arguements for constructor in fundme.sol, put pricefeed address here
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    // #VERIFICATION
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args);
    }
    log("_______________________________________________");
};

module.exports.tags = ["all", "waqar"];

//previously on line 38
//const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
