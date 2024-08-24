import {ethers} from "hardhat";


async function main() {
  if (!process.env.ORACLE_ADDRESS) {
    throw new Error("ORACLE_ADDRESS env variable is not set.");
  }
  const oracleAddress: string = process.env.ORACLE_ADDRESS;
  await deployChatGpt("OpenAiSimpleLLM",oracleAddress);
}


async function deployChatGpt(contractName: string, oracleAddress: string) {
  const agent = await ethers.deployContract(contractName, [oracleAddress], {});

  await agent.waitForDeployment();

  console.log(
    `${contractName} deployed to ${agent.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
