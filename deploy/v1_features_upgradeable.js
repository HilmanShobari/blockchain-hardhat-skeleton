// run: npx hardhat deploy --network goerli --tags v1_features_upgradeable

// script is built for hardhat-deploy plugin:
// A Hardhat Plugin For Replicable Deployments And Easy Testing
// https://www.npmjs.com/package/hardhat-deploy

// BN utils
const {
	toBN,
	print_amt,
} = require("../scripts/include/bn_utils");

// ACL token features and roles
const {
	FEATURE_TRANSFERS,
	FEATURE_TRANSFERS_ON_BEHALF,
	FEATURE_OWN_BURNS,
	FEATURE_BURNS_ON_BEHALF,
} = require("../scripts/include/features_roles");

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

	// ERC20
	{
		// get the v1 implementation and proxy deployments
		const proxy_deployment = await deployments.get("ERC20_Proxy");
		const v1_deployment = await deployments.get("ERC20_v1");

		// print proxy info, and determine if transfers are enabled
		const {features} = await print_erc20_acl_details(A0, v1_deployment.abi, proxy_deployment.address);

		// verify if transfers are enabled and enable if required
		const requested_features = toBN(FEATURE_TRANSFERS | FEATURE_TRANSFERS_ON_BEHALF);
		if(!features.eq(requested_features)) {
			// prepare the updateFeatures call bytes for ERC20 proxy call
			const proxy = new web3.eth.Contract(v1_deployment.abi, proxy_deployment.address);
			const call_data = proxy.methods.updateFeatures(requested_features).encodeABI();

			// update the features as required
			const receipt = await deployments.rawTx({
				from: A0,
				to: proxy_deployment.address,
				data: call_data, // updateFeatures(requested_features)
			});
			console.log("ERC20_Proxy.updateFeatures(%o): %o", requested_features.toString(2), receipt.transactionHash);
		}
	}

	// ERC721
	{
		// get the v1 implementation and proxy deployments
		const proxy_deployment = await deployments.get("ERC721_Proxy");
		const v1_deployment = await deployments.get("ERC721_v1");

		// print proxy info, and determine if transfers are enabled
		const {features} = await print_nft_acl_details(A0, v1_deployment.abi, proxy_deployment.address);

		// verify if transfers are enabled and enable if required
		const requested_features = toBN(FEATURE_TRANSFERS | FEATURE_TRANSFERS_ON_BEHALF | FEATURE_OWN_BURNS | FEATURE_BURNS_ON_BEHALF);
		if(!features.eq(requested_features)) {
			// prepare the updateFeatures call bytes for ERC721 proxy call
			const proxy = new web3.eth.Contract(v1_deployment.abi, proxy_deployment.address);
			const update_features_data = proxy.methods.updateFeatures(requested_features).encodeABI();

			// update the features as required
			const receipt = await deployments.rawTx({
				from: A0,
				to: proxy_deployment.address,
				data: update_features_data, // updateFeatures(requested_features)
			});
			console.log("ERC721_Proxy.updateFeatures(%o): %o", requested_features.toString(2), receipt.transactionHash);
		}
	}
};

// Tags represent what the deployment script acts on. In general, it will be a single string value,
// the name of the contract it deploys or modifies.
// Then if another deploy script has such tag as a dependency, then when the latter deploy script has a specific tag
// and that tag is requested, the dependency will be executed first.
// https://www.npmjs.com/package/hardhat-deploy#deploy-scripts-tags-and-dependencies
module.exports.tags = ["v1_features_upgradeable"];
module.exports.dependencies = ["v1_deploy_upgradeable"];
