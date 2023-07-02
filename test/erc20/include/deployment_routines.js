// ACL token features and roles
const {FEATURE_ALL} = require("../../../scripts/include/features_roles");

// token constants
const {
	NAME,
	SYMBOL,
	DECIMALS,
	TOTAL_SUPPLY: S0,
} = require("../../../scripts/include/erc20_constants");

/**
 * Deploys ERC20 token with all the features enabled
 *
 * @param a0 smart contract owner, super admin
 * @param H0 initial token holder address
 * @returns ERC20 instance
 */
async function erc20_deploy(a0, H0 = a0) {
	// deploy the token
	const token = await erc20_deploy_restricted(a0, H0);

	// enable all permissions on the token
	await token.updateFeatures(FEATURE_ALL, {from: a0});

	// return the reference
	return token;
}

/**
 * Deploys ERC20 token with no features enabled
 *
 * @param a0 smart contract owner, super admin
 * @param H0 initial token holder address
 * @param name token name, ERC20 compatible descriptive name
 * @param symbol token symbol, ERC20 compatible abbreviated name
 * @returns ERC20 instance
 */
async function erc20_deploy_restricted(a0, H0 = a0, name = NAME, symbol = SYMBOL) {
	// smart contracts required
	const ERC20Contract = artifacts.require("./ERC20Mock");

	// deploy the token
	const token = await ERC20Contract.new(name, symbol, {from: a0});

	// mint the initial supply
	await token.mint(H0, S0, {from: a0});

	// return the reference
	return token;
}

/**
 * Deploys Upgradeable ERC20 token with all the features enabled
 *
 * @param a0 smart contract owner, super admin
 * @param H0 initial token holder address
 * @param name token name, ERC20 compatible descriptive name
 * @param symbol token symbol, ERC20 compatible abbreviated name
 * @returns UpgradeableERC20 instance
 */
async function upgradeable_erc20_deploy(a0, H0 = a0, name = NAME, symbol = SYMBOL) {
	// deploy the token
	const token = await upgradeable_erc20_deploy_restricted(a0, H0, name, symbol);

	// enable all permissions on the token
	await token.updateFeatures(FEATURE_ALL, {from: a0});

	// return the reference
	return token;
}

/**
 * Deploys Upgradeable ERC20 token with no features enabled
 *
 * @param a0 smart contract deployer, owner, super admin
 * @param H0 initial token holder address
 * @param name token name, ERC20 compatible descriptive name
 * @param symbol token symbol, ERC20 compatible abbreviated name
 * @returns UpgradeableERC20 instance
 */
async function upgradeable_erc20_deploy_restricted(a0, H0 = a0, name = NAME, symbol = SYMBOL) {
	// smart contracts required
	const ERC20Contract = artifacts.require("./UpgradeableERC20Mock");
	const Proxy = artifacts.require("./ERC1967Proxy");

	// deploy an instance without a proxy
	const instance = await ERC20Contract.new({from: a0});

	// prepare the initialization call bytes
	const init_data = instance.contract.methods.postConstruct(name, symbol).encodeABI();

	// deploy proxy, and initialize the implementation (inline)
	const proxy = await Proxy.new(instance.address, init_data, {from: a0});

	// wrap the proxy into the implementation ABI and return
	const token = await ERC20Contract.at(proxy.address);

	// mint the initial supply
	await token.mint(H0, S0, {from: a0});

	// return the reference
	return token;
}

/**
 * Upgrades Upgradeable ERC20 token with no features enabled
 *
 * @param a0 smart contract deployer, owner, super admin
 * @param proxy previously deployed instance (as a proxy)
 * @param name token name, ERC20 compatible descriptive name
 * @param symbol token symbol, ERC20 compatible abbreviated name
 * @returns UpgradeableERC20 instance
 */
async function upgradeable_erc20_upgrade_restricted(a0, proxy, name = NAME, symbol = SYMBOL) {
	// smart contracts required
	const ERC20Contract = artifacts.require("./UpgradeableERC20Mock2");

	// deploy new instance without a proxy
	const instance = await ERC20Contract.new({from: a0});

	// prepare the initialization call bytes
	const init_data = proxy.contract.methods.postConstruct(name, symbol).encodeABI();

	// and upgrade the implementation
	await proxy.upgradeTo/*AndCall*/(instance.address/*, init_data*/, {from: a0});

	// return the proxy itself
	return proxy;
}

/**
 * Deploys USDT token, used to test non ERC20 compliant transfer function
 * (doesn't return any value on successful operation)
 *
 * @param a0 smart contract owner
 * @param H0 initial token holder address
 * @returns USDT ERC20 instance
 */
async function usdt_deploy(a0, H0 = a0) {
	// smart contracts required
	const USDTContract = artifacts.require("./TetherToken");

	// deploy the token
	const token = await USDTContract.new(S0, "Tether USD", "USDT", 6, {from: a0});

	// move the initial supply if required
	if(H0 !== a0) {
		await token.transfer(H0, S0, {from: a0});
	}

	// return the reference
	return token;
}

// export public deployment API
module.exports = {
	erc20_deploy,
	erc20_deploy_restricted,
	upgradeable_erc20_deploy,
	upgradeable_erc20_deploy_restricted,
	upgradeable_erc20_upgrade_restricted,
	usdt_deploy,
	NAME,
	SYMBOL,
	DECIMALS,
	S0,
};
