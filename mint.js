const dotenv = require('dotenv');
dotenv.config();

const contract = require('./eth-contracts/build/contracts/SolnSquareVerifier');
const ABI = contract.abi


const proofs = [
    require('./eth-contracts/test/proofs/proof'),
    require('./eth-contracts/test/proofs/proof2'),
    require('./eth-contracts/test/proofs/proof3'),
    require('./eth-contracts/test/proofs/proof4'),
    require('./eth-contracts/test/proofs/proof5'),
    require('./eth-contracts/test/proofs/proof6'),
    require('./eth-contracts/test/proofs/proof7'),
    require('./eth-contracts/test/proofs/proof8'),
    require('./eth-contracts/test/proofs/proof9'),
    require('./eth-contracts/test/proofs/proof10')
];


//load env variables
const MNEMONIC = 'ocean mango outside blush track job consider trophy cute logic ignore table';
const INFURA_KEY = '6d61c81aa5c84b30b0af85f58531c1cf';
const OWNER_ADDRESS = '0xb879172a37790c67ac2415c4e65912514df5609a';
const CONTRACT_ADDRESS = '0xC094A88544711600b1Cb9F5e36c2A4abED7f4C19';

const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require('web3');


async function mintTokens() {
    const provider = new HDWalletProvider(MNEMONIC, `https://rinkeby.infura.io/v3/${INFURA_KEY}`);
    const web3Instance = new web3(
        provider
    );

    const contract = new web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS, {gasLimit: "1000000"});
    proofs.forEach(async function (proof, index) {
        console.log(index);
        try {
            const result = await contract.methods.mintVerifiedTokenTo(
                OWNER_ADDRESS,
                index,
                proof.proof.A,
                proof.proof.A_p,
                proof.proof.B,
                proof.proof.B_p,
                proof.proof.C,
                proof.proof.C_p,
                proof.proof.H,
                proof.proof.K,
                proof.input).send({
                from: OWNER_ADDRESS,
                gas: 3900000
            });
            console.log("Mint Transaction: " + result.transactionHash);
        } catch (e) {
            console.log(e);
        }

    });
}

mintTokens();