require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("solidity-coverage");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY_RINKEBY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
    //solidity: "0.8.9",
    solidity: {
        compilers: [{ version: "0.8.9" }, { version: "0.6.6" }],
    },

    defaultNetwork: "hardhat",
    namedAccounts: {
        deployer: {
            default: 0,
            //we can set the positions of account of deployer across chains like this
            //chain ID of diferent chains : position of account
            // e.g (on rinkeby)
            // 4: 1,
            //(on hardhat)
            // 31337: 1,
        },
        user: {
            default: 1,
        },
    },

    networks: {
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6,
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-reeporter.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "ETH",
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
};
