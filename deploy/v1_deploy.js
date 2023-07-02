// deploy: npx hardhat deploy --network goerli --tags v1_deploy
// verify: npx hardhat etherscan-verify --network goerli

// script is built for hardhat-deploy plugin:
// A Hardhat Plugin For Replicable Deployments And Easy Testing
// https://www.npmjs.com/package/hardhat-deploy

// BN utils
const {
	toBN,
	print_amt,
} = require("../scripts/include/bn_utils");

// ERC20 token name and symbol
const {
	NAME: ERC20_NAME,
	SYMBOL: ERC20_SYMBOL,
} = require("../scripts/include/erc20_constants");

// ERC721 token name and symbol
const {
	NAME: NFT_NAME,
	SYMBOL: NFT_SYMBOL,
} = require("../scripts/include/erc721_constants");

// deployment utils (contract state printers)
const {
	print_erc20_acl_details,
	print_nft_acl_details,
} = require("../scripts/deployment_utils");

// to be picked up and executed by hardhat-deploy plugin
module.exports = async function({deployments, getChainId, getNamedAccounts, getUnnamedAccounts}) {
	// print some useful info on the account we're using for the deployment
	const chainId = await getChainId();
	const accounts = await web3.eth.getAccounts();
	// do not use the default account for tests
	const A0 = network.name === "hardhat"? accounts[1]: accounts[0];
	const nonce = await web3.eth.getTransactionCount(A0);
	const balance = await web3.eth.getBalance(A0);

	// print initial debug information
	console.log("network %o %o", chainId, network.name);
	console.log("service account %o, nonce: %o, balance: %o ETH", A0, nonce, print_amt(balance));

	{
		// deploy ERC20 implementation if required
		await deployments.deploy("ERC20", {
			// address (or private key) that will perform the transaction.
			// you can use `getNamedAccounts` to retrieve the address you want by name.
			from: A0,
			contract: "ERC20Mock",
			// the list of argument for the constructor (or the upgrade function in case of proxy)
			args: [ERC20_NAME, ERC20_SYMBOL],
			// if set it to true, will not attempt to deploy even if the contract deployed under the same name is different
			skipIfAlreadyDeployed: true,
			// if true, it will log the result of the deployment (tx hash, address and gas used)
			log: true,
		});
		// get ERC20 implementation deployment details
		const deployment = await deployments.get("ERC20");
		const contract = new web3.eth.Contract(deployment.abi, deployment.address);

		// print ERC20 impl deployment details
		await print_erc20_acl_details(A0, deployment.abi, deployment.address);
	}

	{
		// deploy ERC721 implementation if required
		await deployments.deploy("ERC721", {
			// address (or private key) that will perform the transaction.
			// you can use `getNamedAccounts` to retrieve the address you want by name.
			from: A0,
			contract: "ERC721Mock",
			// the list of argument for the constructor (or the upgrade function in case of proxy)
			args: [NFT_NAME, NFT_SYMBOL],
			// if set it to true, will not attempt to deploy even if the contract deployed under the same name is different
			skipIfAlreadyDeployed: true,
			// if true, it will log the result of the deployment (tx hash, address and gas used)
			log: true,
		});
		// get ERC721 implementation deployment details
		const deployment = await deployments.get("ERC721");
		const contract = new web3.eth.Contract(deployment.abi, deployment.address);

		// print ERC721 impl deployment details
		await print_nft_acl_details(A0, deployment.abi, deployment.address);
	}
};

// Tags represent what the deployment script acts on. In general, it will be a single string value,
// the name of the contract it deploys or modifies.
// Then if another deploy script has such tag as a dependency, then when the latter deploy script has a specific tag
// and that tag is requested, the dependency will be executed first.
// https://www.npmjs.com/package/hardhat-deploy#deploy-scripts-tags-and-dependencies
module.exports.tags = ["v1_deploy"];
