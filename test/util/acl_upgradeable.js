// UpgradeableAccessControl (U-ACL) Core Tests

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
const {
	random_bn255,
} = require("../../scripts/include/bn_utils");

// ACL core features and roles
const {
	not,
	ROLE_ACCESS_MANAGER,
	ROLE_UPGRADE_MANAGER,
} = require("../../scripts/include/features_roles");

// import the core ACL behaviour to use
const {
	behavesLikeACL
} = require("./include/acl.behaviour");

// deployment routines in use
const {
	upgradeable_acl_mock_deploy,
	upgradeable_acl_mock_deploy_via_proxy,
} = require("./include/deployment_routines");

// run UpgradeableAccessControl (U-ACL) tests
contract("UpgradeableAccessControl (U-ACL) Core tests", function(accounts) {
	// extract accounts to be used:
	// A0 – special default zero account accounts[0] used by Truffle, reserved
	// a0 – deployment account having all the permissions, reserved
	// H0 – initial token holder account
	// a1, a2,... – working accounts to perform tests on
	const [A0, a0, H0, a1, a2, a3] = accounts;

	// run the core ACL behaviour test
	behavesLikeACL(async function() {
		return (await upgradeable_acl_mock_deploy_via_proxy(a0)).proxy;
	}, a0, a1, a2);
	behavesLikeACL(async function() {
		const {proxy: acl} = await upgradeable_acl_mock_deploy_via_proxy(a0);
		const v2 = await upgradeable_acl_mock_deploy(a0, 2);
		await acl.upgradeTo(v2.address, {from: a0});
		return acl;
	}, a0, a1, a2);

	// define the "players"
	const by = a1;
	const to = a2;

	// deploy the ACL
	let acl, impl1;
	beforeEach(async function() {
		({proxy: acl, implementation: impl1} = await upgradeable_acl_mock_deploy_via_proxy(a0));
	});

	describe("when there is new (v2) implementation available", function() {
		let impl2;
		beforeEach(async function() {
			impl2 = await upgradeable_acl_mock_deploy(a0, 2);
		});
		describe("when performed by UPGRADE_MANAGER", function() {
			beforeEach(async function() {
				await acl.updateRole(by, ROLE_UPGRADE_MANAGER, {from: a0});
			});
			it("implementation upgrade with initialization fails (already initialized)", async function() {
				// prepare the initialization call bytes
				const init_data = acl.contract.methods.postConstruct().encodeABI();

				// and upgrade the implementation
				await expectRevert(
					acl.upgradeToAndCall(impl2.address, init_data, {from: by}),
					"Initializable: contract is already initialized"
				);
			});
			describe("implementation upgrade without initialization succeeds", function() {
				let receipt;
				beforeEach(async function() {
					receipt = await acl.upgradeTo(impl2.address, {from: by});
				});
				it('"Upgraded" event is emitted', async function() {
					expectEvent(receipt, "Upgraded", {implementation: impl2.address});
				});
				it("implementation address is set as expected", async function() {
					expect(await acl.getImplementation()).to.be.equal(impl2.address);
				});
			});
			it("direct initialization of the implementation (bypassing proxy) fails", async function() {
				await expectRevert(impl1.postConstruct({from: by}), "invalid context");
			});
			it("direct upgrade of the implementation (bypassing proxy) fails", async function() {
				await expectRevert(impl1.upgradeTo(impl2.address, {from: by}), "Function must be called through delegatecall");
			});
		});
		describe("otherwise (no UPGRADE_MANAGER permission)", function() {
			beforeEach(async function() {
				await acl.updateRole(by, not(ROLE_UPGRADE_MANAGER), {from: a0});
			});
			it("implementation upgrade with initialization fails (already initialized)", async function() {
				// prepare the initialization call bytes
				const init_data = acl.contract.methods.postConstruct().encodeABI();

				// and upgrade the implementation
				await expectRevert(
					acl.upgradeToAndCall(impl2.address, init_data, {from: by}),
					"access denied"
				);
			});
			it("implementation upgrade without initialization reverts", async function() {
				await expectRevert(acl.upgradeTo(impl2.address, {from: by}), "access denied");
			});
			it("direct initialization of the implementation (bypassing proxy) fails", async function() {
				await expectRevert(impl1.postConstruct({from: by}), "invalid context");
			});
			it("direct upgrade of the implementation (bypassing proxy) fails", async function() {
				await expectRevert(impl1.upgradeTo(impl2.address, {from: by}), "Function must be called through delegatecall");
			});
		});
	});
});
