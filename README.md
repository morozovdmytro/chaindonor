# ChainDonor

ChainDonor is a blockchain-based platform aimed to facilitate blood donations and provide a transparent and secure system for donors, medical institutions, and recipients. This project leverages Solidity smart contracts and is built on Ethereum.

## Prerequisites

- Node.js and npm
- Git
- Yarn
- Metamask or another web3 provider

## Installation and Setup

### 1. Clone the Repository

### 2. Install Hardhat & Solidity

Install Hardhat locally in your project folder:

```bash
cd smart_contracts
npm install --save-dev hardhat
```

Make sure you have Solidity installed. If not, install it:

```bash
npm install -g solc
```

### 3. Build Smart Contracts

Compile your Solidity smart contracts:

```bash
npx hardhat compile
```

### 4. Run Hardhat Node

Start a local Hardhat Ethereum network:

```bash
npx hardhat node
```

### 5. Deploy Contracts

In a new terminal window, run the deployment script:

```bash
npx hardhat run scripts/deploy.js --network local
```

### 6. Update contract-addresses.json

After successful deployment, update the `contract-addresses.json` file with the deployed contract addresses.

### 7. Frontend Setup

Install frontend dependencies:

```bash
cd frontend
yarn install
```

### 8. Run Frontend Application

Start the frontend application:

```bash
yarn start
```

Your application should now be running at `http://localhost:3000`.

## Usage

1. **Donor Registration**: Donors can register themselves by providing necessary information.
2. **Medical Institutions**: Authorized institutions can add new donations and manage donor information.
3. **Charities**: Authorized charity institutions can add new items as a reward for donations.
3. **Marketplace**: Donors can purchase items using tokens they receive as rewards for donations.