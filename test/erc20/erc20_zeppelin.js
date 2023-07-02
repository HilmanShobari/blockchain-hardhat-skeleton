// OpenZeppelin ERC20 Tests Runner
// See https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/test/token/ERC20/

// ACL token features and roles
const {
	ROLE_TOKEN_CREATOR,
	ROLE_TOKEN_DESTROYER,
} = require("../../scripts/include/features_roles");

// Zeppelin unit tests – delivered as behaviours
// basic ERC20 behaviours
const {
	shouldBehaveLikeERC20,
	shouldBehaveLikeERC20Transfer, // TODO: use it to verify ERC1363 transfers
	shouldBehaveLikeERC20Approve,  // TODO: use it to verify ERC1363 approvals
} = require("./include/zeppelin/ERC20.behavior");
// extended ERC20 behaviours
const {
	shouldHaveBasicProps,
	shouldHaveAtomicApprove,
	shouldHaveMint,
	shouldHaveBurn,
} = require("./include/zeppelin/ERC20.behavior.ext");

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

// run OpenZeppelin ERC20 tests
contract("ERC20: OpenZeppelin ERC20 Tests", function(accounts) {
	// extract accounts to be used:
	// A0 – special default zero account accounts[0] used by Truffle, reserved
	// a0 – deployment account having all the permissions, reserved
	// H0 – initial token holder account
	// a1, a2,... – working accounts to perform tests on
	const [A0, a0, H0, a1, a2] = accounts;

	// define test suite: it will be reused to test several contracts
	function zeppelin_suite(contract_name, deployment_fn) {
		describe(`${contract_name}: Zeppelin Suite`, function() {
			let token;
			beforeEach(async function() {
				// a0 and H0 are ignored when using a fixture
				token = await deployment_fn.call(this, a0, H0);
				// when using a fixture, there is no initial token supply minted
				await token.mint(H0, S0,{from: a0});
			});

			// Zeppelin global setup
			beforeEach(async function() {
				// Zeppelin uses this.token shortcut to access token instance
				this.token = token;
			});

			describe("ERC20 token shouldBehaveLikeERC20", function() {
				// Zeppelin setup for ERC20 transfers: not required, full set of features already on deployment
				shouldBehaveLikeERC20("ERC20: ", S0, H0, a1, a2);
			});
			describe("ERC20 token shouldHaveMint (ext)", function() {
				// Zeppelin setup for token minting
				beforeEach(async function() {
					// Zeppelin uses default zero account A0 (accounts[0]) to mint tokens,
					// grant this address a permission to mint
					await token.updateRole(A0, ROLE_TOKEN_CREATOR, {from: a0});
				});
				shouldHaveMint("ERC20: ", S0, H0, a1);
			});
			describe("ERC20 token shouldHaveBurn (ext)", function() {
				// Zeppelin setup for token burning
				beforeEach(async function() {
					// Zeppelin uses default zero account A0 (accounts[0]) to burn tokens,
					// grant this address a permission to burn
					await token.updateRole(A0, ROLE_TOKEN_DESTROYER, {from: a0});
				});
				shouldHaveBurn("ERC20: ", S0, H0);
			});
			describe("ERC20 token shouldHaveBasicProps (ext)", function() {
				shouldHaveBasicProps(NAME, SYMBOL, DECIMALS);
			});
			describe("ERC20 token shouldHaveApprove (ext)", function() {
				shouldHaveAtomicApprove("ERC20: ", S0, H0, a1);
			});
		});
	}

	zeppelin_suite("ERC20Impl", get_erc20_deployment);
	zeppelin_suite("UpgradeableERC20", get_erc20_upgradeable_deployment);
});
