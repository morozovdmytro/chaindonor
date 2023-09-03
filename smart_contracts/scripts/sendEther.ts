const { ethers } = require("hardhat");

async function main() {
  // Fetch the deployer account
  const [deployer] = await ethers.getSigners();

  await sendEther(
    deployer,
    "0x12C3fc35B3075Ad20985B3171a723A3B5Ee0F21A",
    "10.0"
  );
  await sendEther(
    deployer,
    "0xEb38CF31cE908Ab50592a17dcc611025759C6366",
    "10.0"
  );
  await sendEther(
    deployer,
    "0x432dcC37667F2aC5bDcdAeFA291e01f57fB000ED",
    "10.0"
  );
}

const sendEther = async (deployer, address, amount) => {
  const tx = await deployer.sendTransaction({
    to: address,
    value: ethers.parseEther(amount),
  });

  await tx.wait();
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
