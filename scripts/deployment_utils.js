// functions used in deployment scripts (deploy folder) need to be stored in
// a separate place (folder) otherwise hardhat-deploy plugin tries to pick them up
// and execute as part of the deployment routines

// BN utils
const {
	toBN,
	print_amt,
} = require("./include/bn_utils");

// prints generic ERC20 info (name, symbol, etc.) + AccessControl (features, deployer role)
async function print_erc20_acl_details(a0, abi, address, a1) {
	const web3_contract = new web3.eth.Contract(abi, address);
	const name = await web3_contract.methods.name().call();
	const symbol = await web3_contract.methods.symbol().call();
	const totalSupply = await web3_contract.methods.totalSupply().call();
	const features = toBN(await web3_contract.methods.features().call());
	const r0 = toBN(await web3_contract.methods.userRoles(a0).call());
	const r1 = toBN(a1? await web3_contract.methods.userRoles(a1).call(): 0);
	console.log("successfully connected to ERC20 at %o", address);
	console.table([
		{"key": "Name", "value": name},
		{"key": "Symbol", "value": symbol},
		{"key": "Total Supply", "value": print_amt(totalSupply)},
		{"key": "Features", "value": features.toString(2)}, // 2
		{"key": "Deployer Role", "value": r0.toString(16)}, // 16
		{"key": "A1 Role", "value": r1.toString(16)}, // 16
	]);
	return {features, r0, r1};
}

// prints generic NFT info (name, symbol, etc.) + AccessControl (features, deployer role)
async function print_nft_acl_details(a0, abi, address, a1) {
	const web3_contract = new web3.eth.Contract(abi, address);
	const name = await web3_contract.methods.name().call();
	const symbol = await web3_contract.methods.symbol().call();
	const totalSupply = await web3_contract.methods.totalSupply().call();
	const features = toBN(await web3_contract.methods.features().call());
	const r0 = toBN(await web3_contract.methods.userRoles(a0).call());
	const r1 = toBN(a1? await web3_contract.methods.userRoles(a1).call(): 0);
	console.log("successfully connected to ERC721 at %o", address);
	console.table([
		{"key": "Name", "value": name},
		{"key": "Symbol", "value": symbol},
		{"key": "Total Supply", "value": print_amt(totalSupply)},
		{"key": "Features", "value": features.toString(2)}, // 2
		{"key": "Deployer Role", "value": r0.toString(16)}, // 16
		{"key": "A1 Role", "value": r1.toString(16)}, // 16
	]);
	return {features, r0, r1};
}

// export public module API
module.exports = {
	print_erc20_acl_details,
	print_nft_acl_details,
}
