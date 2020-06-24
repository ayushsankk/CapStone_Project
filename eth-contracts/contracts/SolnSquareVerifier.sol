pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/utils/Address.sol';
import './ERC721Mintable.sol';
import './Verifier.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {


    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 tokenId;
        address to;
    }


    // TODO define an array of the above struct
//    Solutions [] private solutions;


    // TODO define a mapping to store unique solutions submitted (each verification can happen only once)
    mapping(bytes32 => Solution) private solutions;


    // TODO Create an event to emit when a solution is added
    event solutionAdded(address to, uint256 tokenId);


    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(bytes32 key, address to, uint256 tokenId) internal {
        Solution storage solution = solutions[key];

        solution.to = to;
        solution.tokenId = tokenId;

        //emit solutionAdded event
        emit solutionAdded(to, tokenId);
    }

    //Create a public variable to store instance of contract;
    SquareVerifier public verifier;

    //define contract constructor and instantiate verifier value
    constructor (address vAddress) public {
        // call square verifier and pass verifier's address as parameter
        verifier = SquareVerifier(vAddress);
    }



    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintVerifiedTokenTo(address to, uint256 tokenId,
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input) public {

        // check if solution is valid using function from Verifier.sol
        require(verifier.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input), "invalid solution");

        // hash solution key and check if is valid
        bytes32 key = getKey(a, a_p, b, b_p, c, c_p, h, k, input);

        // verify solution not used (in solidity a not-set value equals zero)
        require(solutions[key].to == address(0), "solution already used, try another one");

        // add solution
        addSolution(key, to, tokenId);

        //mint
        super.mint(to, tokenId);
    }

    function getKey(
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    ) pure internal returns(bytes32){
        return keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));
    }


}




