const { getNamedAccounts, ethers, network } = require("hardhat");
const { assert } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

// let variable = false
// let somevar = variable ? "yes" : "no"

//if(variable) {somevar = "yes"} else{somevar = "false"}

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe;
          let deployer;
          const sendValue = ethers.utils.parseEther("0.1");
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              //The reason we're not gonna deploy fundMe and do any fixtures here is because we are assuming we the contract is already deployed on testnet since staging tests are for testnets
              fundMe = await ethers.getContract("FundMe", deployer);
              //we also don't need mock here because  we are on testnet
          });

          it("allows people to fund and withdraw", async function () {
              await fundMe.Fund({ value: sendValue });
              await fundMe.withdraw();
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.address
              );
              console.log(endingBalance.toString());
              assert.equal(endingBalance.toString(), 0);
          });
      });
