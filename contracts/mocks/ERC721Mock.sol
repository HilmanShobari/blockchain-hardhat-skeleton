// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../token/ERC721Impl.sol";

/**
 * @title Zeppelin ERC721 Mock
 *
 * @notice Zeppelin ERC721 Mock simulates an NFT token, used for testing purposes;
 *      it still has restricted access to the mint() function
 *
 * @author Basil Gorin
 */
contract ERC721Mock is ERC721Impl {
	/**
	 * @dev Creates/deploys an NFT Mock instance
	 *
	 * @param _name token name (ERC721Metadata)
	 * @param _symbol token symbol (ERC721Metadata)
	 */
	constructor(string memory _name, string memory _symbol) ERC721Impl(_name, _symbol) {}
}
