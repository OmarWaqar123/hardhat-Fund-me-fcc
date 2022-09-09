// Here we are gonna deploy our own mock price feed contracts
// and we are gonna use it in our deploy-fund-me.js for those networks who don't have
// price feed contracts already like hardhat or loalhost
const { network } = require("hardhat");
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;

    //if(chainId == "31337")
    // or
    //include is a function which checks if some variable is inside an array
    if (developmentChains.includes(network.name)) {
        log("local Network Detected Deploying Mocks.....");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true, //this "log: true" means it'll display whats goin on with the deployment
            args: [DECIMALS, INITIAL_ANSWER],
            //we can see what parameters do we have to give the constructor of MockV3Aggregator.sol on github or in modules here
        });
        log("Mocks Deployed!");
        log("____________________________________________________");
    }
};

module.exports.tags = ["all", "mocks"];
