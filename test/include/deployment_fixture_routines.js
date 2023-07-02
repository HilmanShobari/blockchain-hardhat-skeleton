// we use hardhat deployment to work with fixtures
// see https://github.com/wighawag/hardhat-deploy#creating-fixtures
const {deployments} = require('hardhat');

/**
 * Gets ERC20 token with all the features enabled
 *
 * @returns ERC20 instance
 */
async function get_erc20_deployment() {
	// make sure fixtures were deployed, this can be also done via --deploy-fixture test flag
	// see https://github.com/wighawag/hardhat-deploy#creating-fixtures
	await deployments.fixture();

	// get deployed contract address
	const {address} = await deployments.get("ERC20");

	// connect to the contract instance and return it
	const Contract = artifacts.require("./ERC20Mock");
	return await Contract.at(address);
}

/**
 * Gets Upgradeable ERC20 token with all the features enabled
 *
 * @returns Upgradeable ERC20 instance (ERC1967 Proxy)
 */
async function get_erc20_upgradeable_deployment() {
	// make sure fixtures were deployed, this can be also done via --deploy-fixture test flag
	// see https://github.com/wighawag/hardhat-deploy#creating-fixtures
	await deployments.fixture();

	// get deployed contract address
	const {address} = await deployments.get("ERC20_Proxy");

	// connect to the contract instance and return it
	const Contract = artifacts.require("./UpgradeableERC20Mock");
	return await Contract.at(address);
}

/**
 * Gets ERC721 token with all the features enabled
 *
 * @returns ERC721 instance
 */
async function get_erc721_deployment() {
	// make sure fixtures were deployed, this can be also done via --deploy-fixture test flag
	// see https://github.com/wighawag/hardhat-deploy#creating-fixtures
	await deployments.fixture();

	// get deployed contract address
	const {address} = await deployments.get("ERC721");

	// connect to the contract instance and return it
	const Contract = artifacts.require("./ERC721Mock");
	return await Contract.at(address);
}

/**
 * Gets Upgradeable ERC721 token with all the features enabled
 *
 * @returns Upgradeable ERC721 instance (ERC1967 Proxy)
 */
async function get_erc721_upgradeable_deployment() {
	// make sure fixtures were deployed, this can be also done via --deploy-fixture test flag
	// see https://github.com/wighawag/hardhat-deploy#creating-fixtures
	await deployments.fixture();

	// get deployed contract address
	const {address} = await deployments.get("ERC721_Proxy");

	// connect to the contract instance and return it
	const Contract = artifacts.require("./UpgradeableERC721Mock");
	return await Contract.at(address);
}

// export public deployment API
module.exports = {
	get_erc20_deployment,
	get_erc20_upgradeable_deployment,
	get_erc721_deployment,
	get_erc721_upgradeable_deployment,
};
