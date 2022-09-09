// //we're first gonna deploy the FundMe contract in the 1st before each and here
// // we are pulling in deploy objects from hardhat-deploy

// const { assert } = require("chai");
// const { deployments, ethers, getNamedAccounts } = require("hardhat");

// describe("FundMe", async function () {
//   let fundMe;
//   let deployer;
//   let mockV3aggregator;
//   beforeEach(async function () {
//     // deploy our fundMe contract
//     // using Hardhat-deploy, but if we want to deploy FundMe then it'll come with 2 deploy.js scripts including mocks
//     //fixture is a function of deployments object,fixture alows us to  run deploy folder with as many tags as we want(only for testing scenarios)
//     deployer = (await getNamedAccounts()).deployer;
//     await deployments.fixture(["all"]);
//     // const accounts = await ethers.getSigners();
//     // const accountZero = accounts[0];
//     fundMe = await ethers.getContract("FundMe", deployer);
//     mockV3aggregator = await ethers.getContract("MockV3Aggregator", deployer);
//   });

//   describe("Constructor", async function () {
//     it("sets the aggregator address correctly", async function () {
//       const response = await fundMe.getPriceFeed();
//       //since we are gonna run this test locally so we wanna make sure that this getPriceFeed is gonna be same as our mockV3aggregator
//       assert.equal(response, mockV3aggregator.address);
//     });
//   });
// });

const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let deployerfundMe, mockV3aggregator;
          const sendValue = ethers.utils.parseEther("1"); //1 ETH   // or  "1000000000000000000"

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture(["all"]);
              fundMe = await ethers.getContract("FundMe", deployer);
              mockV3aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              );
          });

          describe("Contract", async function () {
              it("sets the aggregator address correctly", async function () {
                  const response = await fundMe.getPriceFeed();
                  assert.equal(response, mockV3aggregator.address);
              });
          });

          describe("Fund", async function () {
              it("Fails if you don't send enough ETH", async function () {
                  //here we want to check if we don't send enough ETH will this  contract actually fails and revert with the msg described in FundMe.
                  // if we don't pass any value in Fund(SOMETHING) we will fail and run into error
                  await expect(fundMe.Fund()).to.be.revertedWith(
                      "Didn't send enough eth "
                  );
              });

              it("updates The amount funded data structure(mapping)", async function () {
                  await fundMe.Fund({ value: sendValue });
                  const response = await fundMe.getAddresstoamountTrack(
                      deployer
                  );
                  assert.equal(response.toString(), sendValue.toString());
              });

              it("Adds funder to array of getFunder", async function () {
                  await fundMe.Fund({ value: sendValue });
                  const funder = await fundMe.getFunder(0); //calling the getFunder array at index 0
                  assert.equal(funder, deployer);
              });
          });

          describe("Withdraw", async function () {
              beforeEach(async function () {
                  //we're doing this beforeEach here again cause inorder to withdraw money from the contract we need the contract to have
                  //some money already stored before so we can withdraw it.
                  await fundMe.Fund({ value: sendValue });
              });

              it("withdraw ETH from a single founder", async function () {
                  //Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(
                          //or fundMe.provider.getBalance
                          fundMe.address
                      );
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  //Act
                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, effectiveGasPrice } = transactionReceipt; //here the curly bracket syntax is used to pull out objects from another object
                  const gasCost = gasUsed.mul(effectiveGasPrice); //since gasUsed and effectiveGasPrice are bignumbers so we use bigNumbers function to multiply them instead of *

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);

                  //Assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      //since startingFundMeBalance is calling from blockchain it is gonna be of type BigNumber (according to ether.js)
                      // so because of BigNumber we'll use " Bignumber.add(otherValue) ",check ethers docs for more info
                      // startingFundMeBalance + startingDeployerBalance,
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(), //since bigNumber are objects and their identity is a bit wierd so we'll convert them in string as well
                      endingDeployerBalance.add(gasCost).toString() //since wehen we'll call withdraw the deployer some eth in gas as well so we need to add this as well
                  );
              });

              it("Cheaper withdraw single funder", async function () {
                  //Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(
                          //or fundMe.provider.getBalance
                          fundMe.address
                      );
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, effectiveGasPrice } = transactionReceipt; //here the curly bracket syntax is used to pull out objects from another object
                  const gasCost = gasUsed.mul(effectiveGasPrice); //since gasUsed and effectiveGasPrice are bignumbers so we use bigNumbers function to multiply them instead of *

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);

                  //Assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      //since startingFundMeBalance is calling from blockchain it is gonna be of type BigNumber (according to ether.js)
                      // so because of BigNumber we'll use " Bignumber.add(otherValue) ",check ethers docs for more info
                      // startingFundMeBalance + startingDeployerBalance,
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(), //since bigNumber are objects and their identity is a bit wierd so we'll convert them in string as well
                      endingDeployerBalance.add(gasCost).toString() //since wehen we'll call withdraw the deployer some eth in gas as well so we need to add this as well
                  );
              });

              it("allows us to withdraw with multiple getFunder", async function () {
                  // Arrange
                  const accounts = await ethers.getSigners();
                  const accounts_address = accounts[1];
                  const { address } = accounts_address;
                  //we are starting for loop from 1 signers because 0th signer is deployer
                  //
                  for (let i = 1; i < 6; i++) {
                      //the reason we're using connect function here is because at the top of this test in 1st beforeEach we connect our fundMe contract to our deployer only at line 42 therefore anytime we call a transaction from FundMe the deployer is the account calling that transaction
                      //therefore we need to create new objects to connect to these different accounts.
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      ); //here connecting accounts means we are not just connecting accounts[]'s address but the whole account to fundMe which includes moere than just address
                      await fundMeConnectedContract.Fund({ value: sendValue });
                  }

                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);

                  // Act

                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  //Assert

                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );

                  // Make sure getFunder are reset properly and mapping of all address to money is zero
                  await expect(fundMe.getFunder(0)).to.be.reverted;

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddresstoamountTrack(
                              accounts[i].address
                          ),
                          0
                      );
                  }
              });
              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners();
                  const attacker = accounts[1];
                  //here connecting attacker's accounts means we are not just connecting accounts[]'s address but the whole account to fundMe which includes moere than just address
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  );
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(
                      attackerConnectedContract,
                      "FundMe__NotOwner"
                  );
                  //meaning we are checking that no one else other than deployer or owner can call withdraw function
              });

              it("Cheaper Withdraw testing.....", async function () {
                  // Arrange
                  const accounts = await ethers.getSigners();
                  const accounts_address = accounts[1];
                  const { address } = accounts_address;
                  //we are starting for loop from 1 signers because 0th signer is deployer
                  //
                  for (let i = 1; i < 6; i++) {
                      //the reason we're using connect function here is because at the top of this test in 1st beforeEach we connect our fundMe contract to our deployer only at line 42 therefore anytime we call a transaction from FundMe the deployer is the account calling that transaction
                      //therefore we need to create new objects to connect to these different accounts.
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      ); //here connecting accounts means we are not just connecting accounts[]'s address but the whole account to fundMe which includes moere than just address
                      await fundMeConnectedContract.Fund({ value: sendValue });
                  }

                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);

                  // Act

                  const transactionResponse = await fundMe.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  //Assert

                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );

                  // Make sure getFunder are reset properly and mapping of all address to money is zero
                  await expect(fundMe.getFunder(0)).to.be.reverted;

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddresstoamountTrack(
                              accounts[i].address
                          ),
                          0
                      );
                  }
              });
          });
      });
