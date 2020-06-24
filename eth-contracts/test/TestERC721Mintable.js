var ERC721MintableComplete = artifacts.require('CustomERC721Token');

var SquareVerifier = artifacts.require('SquareVerifier');

const proof = require('./proofs/proof')
const proof2 = require('./proofs/proof2')
const proof3 = require('./proofs/proof3')
const proof4 = require('./proofs/proof4')
const proof5 = require('./proofs/proof5')
const proof6 = require('./proofs/proof6')
const proof7 = require('./proofs/proof7')

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const account_five = accounts[4];
    const account_six = accounts[5];


    describe('match erc721 spec', function () {
        beforeEach(async function () {
            let sqVerifier = await SquareVerifier.new({from: account_one});
            this.contract = await ERC721MintableComplete.new(sqVerifier.address, {from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(
                account_two,
                0,
                {from: account_one});
            await this.contract.mint(
                account_three,
                1,
                {from: account_one});
            await this.contract.mint(
                account_four,
                2,
                {from: account_one});
            await this.contract.mint(
                account_five,
                3,
                {from: account_one});
            await this.contract.mint(
                account_six,
                4,
                {from: account_one});
        })

        it('should return total supply', async function () {
            let result = await this.contract.totalSupply.call({from: account_one});
            assert.equal(result.toNumber(), 5, "Error calculating total supply");
        })

        it('should get token balance', async function () {
            let result = await this.contract.balanceOf.call(account_five, {from:account_one});
            assert.equal(result.toNumber(), 1, "Wrong balance for account_five");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let result = await this.contract.tokenURI.call(1, {from: account_one});
            assert.equal(result, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Error fetching token uri");
        })

        it('should transfer token from one owner to another', async function () {
            const tokenId = 0;

            //is token approved?
            let approvedAddress = await this.contract.getApproved.call(tokenId, {from:account_one});
            assert.equal(parseInt(approvedAddress), 0, "Should not be able to retrieve an approved token");

            //add approval for account_four
            await this.contract.approve(account_four, tokenId, {from: account_two});
            approvedAddress = await this.contract.getApproved.call(tokenId, {from: account_one});
            assert.equal(approvedAddress, account_four, "This should be app<roved for account_four");

            //verify current owner
            let owner = await this.contract.ownerOf.call(tokenId, {from: account_one});
            assert.equal(owner, account_two, "Owner is not account_two");

            /*
            Check balances of account_thw & account_six
            transfer from account_two to account_six
            Check new balances of account_thw & account_six
             */

            let accountBalance = await this.contract.balanceOf.call(account_two, {from: account_one});
            assert.equal(accountBalance.toNumber(), 1, "Error in account balance for account_two");


            accountBalance = await this.contract.balanceOf.call(account_six, {from: account_one});
            assert.equal(accountBalance.toNumber(), 1, "Error in account balance for account_six");

            await this.contract.transferFrom(account_two, account_six, tokenId, {from: account_two});

            accountBalance = await this.contract.balanceOf.call(account_two, {from: account_one});
            assert.equal(accountBalance.toNumber(), 0, "Error in account balance for account_two (should be zero)");


            accountBalance = await this.contract.balanceOf.call(account_six, {from: account_one});
            assert.equal(accountBalance.toNumber(), 2, "Error in account balance for account_six (should be two");

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            let sqVerifier = await SquareVerifier.new({from: account_one});
            this.contract = await ERC721MintableComplete.new(sqVerifier.address, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let reverted = false;

            try {
                await this.contract.mint(
                    account_two,
                    123,
                    {from: account_two});
            } catch (e) {
                reverted = true;
            }

            assert.equal(reverted, true, "Minting should have failed");
        });

        it('should return contract owner', async function () {
            let contract_owner = await this.contract._owner.call({from: account_one});
            assert.equal(contract_owner, account_one, "Error retrieving contract owner");
        });


        it('Verify correct handling of ownership transfer', async function () {
            // verify owner is account_one
            let contract_owner = await this.contract._owner.call({from: account_one});
            assert.equal(contract_owner, account_one, "First account should be contract owner");

            //attempt (but must not allow) transfer of ownership by account_two, to account_two
            let reverted = false;
            try {
                await this.contract.transferOwnership(account_two, {from:account_two});
            } catch (e) {
                reverted = true;
            }

            assert.equal(reverted, true, "Erroneous ownership transfer.")

            //transfer ownership from account_one to
            reverted = false;
            try {
                await this.contract.transferOwnership(account_two, {from:account_one});
            } catch (e) {
                reverted = true;
            }

            assert.equal(reverted, false, "Unable to change owner.");

            contract_owner = await this.contract._owner.call({from: account_one});
            assert.equal(contract_owner, account_two, "Second account should be contract owner");

        });
    });
})