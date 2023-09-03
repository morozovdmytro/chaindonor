const { ethers } = require("hardhat");

async function main() {
  // Fetch the deployer account
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Deploy BloodToken
  const BloodToken = await ethers.getContractFactory("BloodToken");
  const bloodToken = await BloodToken.deploy();
  const bloodTokenAddress = await bloodToken.getAddress();
  console.log(`BloodToken deployed at: ${bloodTokenAddress}`);

  // Deploy DonorApp
  const DonorApp = await ethers.getContractFactory("ChainDonorHub");
  const donorApp = await DonorApp.deploy(bloodTokenAddress); // Assuming the DonorApp takes the BloodToken address as a constructor argument
  console.log(`DonorApp deployed at: ${await donorApp.getAddress()}`);
  await bloodToken.setMinter(await donorApp.getAddress()); // Set the DonorApp as the minter of the BloodToken
  console.log(`DonorApp set as minter of BloodToken`);

  // Deploy Marketplace
  const Marketplace = await ethers.getContractFactory("ChainDonorMarketplace");
  const marketplace = await Marketplace.deploy(bloodTokenAddress); // Assuming the Marketplace takes the BloodToken address as a constructor argument
  console.log(`Marketplace deployed at: ${await marketplace.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
