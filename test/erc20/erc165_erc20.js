// ERC20: ERC165 Interface ID tests

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

// ERC165 tests runner helper by vittominacori
const {
	shouldSupportInterfaces,
} = require("../include/SupportsInterface.behavior");

// deployment routines in use
const {
	erc20_deploy_restricted,
	upgradeable_erc20_deploy_restricted,
	S0,
} = require("./include/deployment_routines");

// deployment fixture routines in use
const {
	get_erc20_deployment,
	get_erc20_upgradeable_deployment,
} = require("../include/deployment_fixture_routines");

// run ERC165 Interface ID tests
contract("ERC20: ERC165 Interface ID tests", function(accounts) {
	// extract accounts to be used:
	// A0 – special default zero account accounts[0] used by Truffle, reserved
	// a0 – deployment account having all the permissions, reserved
	// H0 – initial token holder account
	// a1, a2,... – working accounts to perform tests on
	const [A0, a0, H0, a1, a2] = accounts;

	// define test suite: it will be reused to test several contracts
	function erc165_suite(contract_name, deployment_fn) {
		let token;
		beforeEach(async function() {
			// a0 and H0 are ignored when using a fixture
			token = await deployment_fn.call(this, a0, H0);
		});

		describe("run vittominacori's shouldSupportInterfaces", function() {
			beforeEach(async function() {
				// shouldSupportInterfaces uses this.token shortcut to access token instance
				this.token = token;
			});
			shouldSupportInterfaces(["ERC20"]);
		});
	}

	erc165_suite("ERC20Impl", get_erc20_deployment);
	erc165_suite("UpgradeableERC20", get_erc20_upgradeable_deployment);
});
