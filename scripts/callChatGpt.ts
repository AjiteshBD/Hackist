const {ethers} = require("hardhat");

import * as readline from 'readline';

require("dotenv").config()

async function main() {
  // const rpcUrl = process.env.RPC_URL
  // if (!rpcUrl) throw Error("Missing RPC_URL in .env")
  // const privateKey = process.env.PRIVATE_KEY
  // if (!privateKey) throw Error("Missing PRIVATE_KEY in .env")
  const contractAddress = process.env.SIMPLE_LLM_CONTRACT_ADDRESS
  if (!contractAddress) throw Error("Missing SIMPLE_LLM_CONTRACT_ADDRESS in .env")

  // const provider = new ethers.JsonRpcProvider(rpcUrl)
  // const wallet = new Wallet(
  //   privateKey, provider
  // )

  const ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "initialOracleAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "getMessageHistory",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "role",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "contentType",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "value",
                  "type": "string"
                }
              ],
              "internalType": "struct IOracle.Content[]",
              "name": "content",
              "type": "tuple[]"
            }
          ],
          "internalType": "struct IOracle.Message[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "message",
      "outputs": [
        {
          "internalType": "string",
          "name": "role",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "runId",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "id",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "content",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "functionName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "functionArguments",
              "type": "string"
            },
            {
              "internalType": "uint64",
              "name": "created",
              "type": "uint64"
            },
            {
              "internalType": "string",
              "name": "model",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "systemFingerprint",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "object",
              "type": "string"
            },
            {
              "internalType": "uint32",
              "name": "completionTokens",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "promptTokens",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "totalTokens",
              "type": "uint32"
            }
          ],
          "internalType": "struct IOracle.OpenAiResponse",
          "name": "_response",
          "type": "tuple"
        },
        {
          "internalType": "string",
          "name": "_errorMessage",
          "type": "string"
        }
      ],
      "name": "onOracleOpenAiLlmResponse",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "response",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_message",
          "type": "string"
        }
      ],
      "name": "sendMessage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(contractAddress, ABI, signer)

  // The message you want to start the chat with
  const message = await getUserInput()

  // Call the sendMessage function
  const transactionResponse = await contract.sendMessage(message)
  const receipt = await transactionResponse.wait()
  console.log(`Message sent, tx hash: ${receipt.hash}`)
  console.log(`Chat started with message: "${message}"`)

  // Read the LLM response on-chain
  while (true) {
    const response = await contract.response();
    if (response) {
      console.log("Response from contract:", response);
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 100000))
  }
}

async function getUserInput(): Promise<string | undefined> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        resolve(answer)
      })
    })
  }

  try {
    const input = await question("Message ChatGPT: ")
    rl.close()
    return input
  } catch (err) {
    console.error('Error getting user input:', err)
    rl.close()
  }
}


main()
  .then(() => console.log("Done"))