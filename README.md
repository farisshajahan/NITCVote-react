# React frontend for voting dApp on Ethereum

## Introduction
The problem of fair and democratic elections is definitely one of the toughest problems faced by the world today. Corruption and distrust everywhere
stand as obstructions to the conduction of such elections. The blockchain technology could definitely help a little in this aspect. Decentralised elections can
fix the issue of trust and guarantee fair elections. However implementing such a solution nationwide is not an easy task considering the presence of people in many
developing countries who are not even familiar with or seen smartphones. NITCVote is a project to tackle a much smaller use case; elections within universities for student representatives. The project is based on Johannes Mols ethVote project and has been enhanced to provide better security and secrecy of votes.

The code for this project is distributed in three repositories:  
[Smart Contracts](https://github.com/farisshajahan/NITCVote)  
[Backend](https://github.com/appu313/NITCVote-backend)  
[Frontend](https://github.com/farisshajahan/NITCVote-react)

### Development

1. Clone the voting dApp and deploy the contracts to Ganache
2. Note the addresses of the deployed contracts
3. `git clone https://github.com/farisshajahan/NITCVote-react`
4. `cd NITCVote-react`
5. `npm install`
6. Open `src/ethereum/addresses.js` and insert the contract addresses there.
7. `npm start`

The webpage should be up at `http://localhost:3000`

### Production build

Run `npm run build` to generate a production build that can be hosted on a webserver.
