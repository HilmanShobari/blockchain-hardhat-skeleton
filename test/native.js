// native tests doesn't do any smart contract(s) interaction

// using the BDD with chai in this test script

// Zeppelin test helpers
const {
	BN,
	balance,
	constants,
	expectEvent,
	expectRevert,
} = require("@openzeppelin/test-helpers");
const {
	assert,
	expect,
} = require("chai");
// enable chai-bn plugin
// require('chai').use(require('chai-bn')(web3.utils.BN));
const {
	ZERO_ADDRESS,
	ZERO_BYTES32,
	MAX_UINT256,
} = constants;

// BN utils
const {
	print_amt,
} = require("../scripts/include/bn_utils");

// block utils
const {
	extract_gas_cost,
} = require("./include/block_utils");

// Truffle style contract testing
contract("Native Tests: no smart contract interaction", function(accounts) {
	// native transfer cost: 21,000 gas
	// default gas cost: 21 Gwei
	const min_balance = new BN(21_000 * 21).mul(new BN(10).pow(new BN(9)));

	it("some accounts exist", async function() {
		expect(accounts, "accounts array is undefined").to.exist;
		expect(accounts.length, "accounts array is empty").to.be.gt(0);
	});
	it("default account has some native currency", async function() {
		expect(await balance.current(accounts[0])).to.be.bignumber.greaterThan("0");
	});
	it(`default account has more than ${min_balance} native currency`, async function() {
		expect(await balance.current(accounts[0])).to.be.bignumber.greaterThan(min_balance);
	});
	it("at least 2 accounts exist", async function() {
		expect(accounts.length, "accounts array is empty").to.be.gt(1);
	});
	for(let i = 0; i < accounts.length; i++) {
		it(`account${i} balance can be fetched`, async function() {
			const tracker = await balance.tracker(accounts[i]);
			console.log(`account${i} %o balance: %o`, accounts[i], print_amt(await tracker.get()));
		});
	}
	describe("native transfer succeeds", function() {
		let tracker0, tracker1;
		before(async function() {
			tracker0 = await balance.tracker(accounts[0]);
			tracker1 = await balance.tracker(accounts[1]);
		});

		let value, receipt;
		before(async function() {
			const balance0 = await tracker0.get();
			value = BN.min(balance0.sub(min_balance), new BN(10).pow(new BN(15)));
			console.log("sending %o from account0 to account1", print_amt(value));
			receipt = await web3.eth.sendTransaction({
				from: accounts[0],
				to: accounts[1],
				value,
			});
			console.log("%o: fee %o", receipt.transactionHash, print_amt(await extract_gas_cost(receipt)));
		});
/*
		after(async function() {
			const balance1 = await tracker1.get();
			value = balance1.sub(min_balance);
			console.log("sending %o from account1 to account0", print_amt(value));
			receipt = await web3.eth.sendTransaction({
				from: accounts[1],
				to: accounts[0],
				value,
			});
			console.log("%o: fee %o", receipt.transactionHash, print_amt(await extract_gas_cost(receipt)));
		});
*/
		it("transfer cost is 21,000 gas", async function() {
			expect(receipt.gasUsed).to.be.equal(21_000);
		});
		it("account 0 balance decreases as expected", async function() {
			const deltaWithFees = await tracker0.deltaWithFees();
			const delta = deltaWithFees.delta;
			const fees = deltaWithFees.fees;
			expect(delta).to.be.bignumber.that.equals(value.neg().sub(fees));
		});
		it("account 1 balance increases as expected", async function() {
			expect(await tracker1.delta()).to.be.bignumber.that.equals(value);
		});
	});
});
