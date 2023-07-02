// Mint/Burn ERC20 Tests addon

// Zeppelin test helpers
const {
	BN,
	constants,
	expectEvent,
	expectRevert,
} = require("@openzeppelin/test-helpers");
const {
	assert,
	expect,
} = require("chai");
const {
	ZERO_ADDRESS,
	ZERO_BYTES32,
	MAX_UINT256,
} = constants;

// BN constants and utilities
const {random_bn} = require("../../scripts/include/bn_utils");

// deployment routines in use
const {
	erc20_deploy,
	upgradeable_erc20_deploy,
	NAME,
	SYMBOL,
	DECIMALS,
	S0,
} = require("./include/deployment_routines");

// deployment fixture routines in use
const {
	get_erc20_deployment,
	get_erc20_upgradeable_deployment,
} = require("../include/deployment_fixture_routines");

// run Mint/Burn ERC20 Tests addons
contract("ERC20: Mint/Burn Tests addons", function(accounts) {
	// extract accounts to be used:
	// A0 – special default zero account accounts[0] used by Truffle, reserved
	// a0 – deployment account having all the permissions, reserved
	// H0 – initial token holder account
	// a1, a2,... – working accounts to perform tests on
	const [A0, a0, H0, a1, a2] = accounts;

	function run_erc20_mint_burn_tests_addon(contract_name, deployment_fn) {
		describe(`${contract_name}: Mint/Burn Tests addons`, function() {
			let token;
			beforeEach(async function() {
				// a0 and H0 are ignored when using a fixture
				token = await deployment_fn.call(this, a0, H0);
				// when using a fixture, there is no initial token supply minted
				await token.mint(H0, S0,{from: a0});
			});

			const by = a0;
			const to = a1;
			const from = H0;
			const value = random_bn(1, S0);
			describe("mint", function() {
				let receipt;
				beforeEach(async function() {
					receipt = await token.mint(to, value, {from: by});
				});
				it('should emit "Minted" event', async function() {
					expectEvent(receipt, "Minted", {by, to, value});
				});
			});
			describe("burn", function() {
				let receipt;
				beforeEach(async function() {
					receipt = await token.burn(from, value, {from: by});
				});
				it('should emit "Burnt" event', async function() {
					expectEvent(receipt, "Burnt", {by, from, value});
				});
			});
		});
	}

	run_erc20_mint_burn_tests_addon("ERC20Impl", get_erc20_deployment);
	run_erc20_mint_burn_tests_addon("UpgradeableERC20", get_erc20_upgradeable_deployment);
});
