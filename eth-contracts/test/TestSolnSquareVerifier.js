// Test if a new solution can be added for contract - SolnSquareVerifier
const valid_proof = require('./proofs/proof');
const proof = valid_proof.proof;
const input = valid_proof.input;

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
var SquareVerifier = artifacts.require('SquareVerifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('check approvals', function () {
        beforeEach(async function () {
            const sqVerifier = await SquareVerifier.new({from: account_one});
            this.contract = await SolnSquareVerifier.new(sqVerifier.address, {from: account_one});
        });



        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('new solution can be added for contract - disallow duplicates ', async function () {

            let reverted = false;
            await this.contract.mintVerifiedTokenTo(
                account_two,
                123,
                proof.A,
                proof.A_p,
                proof.B,
                proof.B_p,
                proof.C,
                proof.C_p,
                proof.H,
                proof.K,
                input,
                {from: account_one});

            try {
                await this.contract.mintVerifiedTokenTo(
                    account_two,
                    123,
                    proof.A,
                    proof.A_p,
                    proof.B,
                    proof.B_p,
                    proof.C,
                    proof.C_p,
                    proof.H,
                    proof.K,
                    input,
                    {from: account_one});
            } catch {
                reverted = true;
            }

            assert.equal(reverted, true, "Should not be able to mint same solution");
        });

                // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
         it('ERC721 token can be minted for contract', async function () {
                    await this.contract.mintVerifiedTokenTo(
                        account_two,
                        123,
                        proof.A,
                        proof.A_p,
                        proof.B,
                        proof.B_p,
                        proof.C,
                        proof.C_p,
                        proof.H,
                        proof.K,
                        input,
                        {from: account_one})
        
                    let owner = await this.contract.ownerOf(123);
                    assert.equal(owner, account_two, "expected owner does not match");
                });

    });
});