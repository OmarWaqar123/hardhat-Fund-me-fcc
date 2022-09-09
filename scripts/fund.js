// In future if we want to fund any contracts quickly we can do this from here .
//This script will only work for localhost and rinkeby but not on hardhat because when we run ``yarn hardhat node``
//this will run our local node with All of our Contracts deployed.so it will work on localhost only.If we run this script on hardhat this will show error
//saying no contracts are deployed on hardhat.BUT THIS SCRIPT WILL RUN ON RINKEBY.~
//Through scripts we are basically interacting with our contract
const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log("Funding Contract.................");
    const transactionResponse = await fundMe.Fund({
        value: ethers.utils.parseEther("0.1"),
    });

    await transactionResponse.wait(1);
    console.log("Funded!!!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
