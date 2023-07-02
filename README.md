# Qoin Solidity Boilerplate #
This repo contains a template for Solidity development on Ethereum.
It is Hardhat/Web3/Truffle based and includes the following components preinstalled/configured:
* Development
    * @openzeppelin/contracts – OpenZeppelin quick and dirty (but still well tested) implementations for 95%
    of the stuff one may need
* Testing:
    * @nomiclabs/hardhat-web3 – Web3 Hardhat plugin
    * @nomiclabs/hardhat-truffle5 – Truffle Hardhat plugin
    * @openzeppelin/test-helpers – OpenZeppelin test helpers, convenient for event parsing, tx revert asserts,
    balance tracking, etc.
    * chai – provides a convenient [BDD](https://devhints.io/chai) unit testing support
    * solidity-coverage – test coverage for Solidity, preconfigured in [.solcover.js](.solcover.js)
* Deployment
    * hardhat-deploy – a hardhat plugin for replicable deployments and easy testing by Ronan Sandford
    * @nomiclabs/hardhat-etherscan – etherscan source code verification made easy

Note: search for "awesome" and replace with your own project name

The project is built using
* [Hardhat](https://hardhat.org/), a popular Ethereum development environment
    * Why not standalone [Truffle](https://www.trufflesuite.com/truffle)?
        * Truffle runs the tests several times slower than Hardhat
        * Truffle + [ganache](https://trufflesuite.com/ganache/) fails to run big test suites,
        presumably it fails to close socket connections gracefully and causes open sockets overflow
    * Why not [Foundry](https://github.com/foundry-rs/foundry)?
        * Foundry forces the tests to be written in Solidity, which complicates
            * porting the existing tests from myriad of projects using JavaScript for tests,
            * getting help from the vast community of [Node.js](https://nodejs.org/en) developers in writing tests
* [Web3.js](https://web3js.readthedocs.io/), a collection of libraries that allows interacting with
local or remote Ethereum node using HTTP, IPC or WebSocket
* [Truffle](https://www.trufflesuite.com/truffle) as a Hardhat module (plugin)

Smart contracts deployment is configured to use [Infura](https://infura.io/)
and [HD Wallet](https://www.npmjs.com/package/@truffle/hdwallet-provider)

## Repository Description ##
What's inside?

* Some Awesome Stuff

## Installation ##

Following steps were tested to work in macOS Catalina

1. Clone the repository  
    ```git clone git@github.com:vgorin/solidity-template.git```
2. Navigate into the cloned repository  
    ```cd solidity-template```
3. Install [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) – latest  
    ```brew install nvm```
4. Install [Node package manager (npm)](https://www.npmjs.com/) and [Node.js](https://nodejs.org/) – version 16.9.0+  
    ```nvm install 16```
5. Activate node version installed  
    ```nvm use 16```
6. Install project dependencies  
    ```npm install```

### Troubleshooting ###
* After executing ```nvm use 16``` I get  
    ```
    nvm is not compatible with the npm config "prefix" option: currently set to "/usr/local/Cellar/nvm/0.37.2/versions/node/v16.9.0"
    Run `npm config delete prefix` or `nvm use --delete-prefix v16.9.0` to unset it.
    ```
    Fix:  
    ```
    nvm use --delete-prefix v16.9.0
    npm config delete prefix
    npm config set prefix "/usr/local/Cellar/nvm/0.37.2/versions/node/v16.9.0"
    ```
* After executing ```npm install``` I get
    ```
    npm ERR! code 127
    npm ERR! path ./solidity-template/node_modules/utf-8-validate
    npm ERR! command failed
    npm ERR! command sh -c node-gyp-build
    npm ERR! sh: node-gyp-build: command not found
    
    npm ERR! A complete log of this run can be found in:
    npm ERR!     ~/.npm/_logs/2023-08-30T07_10_23_362Z-debug.log
    ```
    Fix:  
    ```
    npm install -g node-gyp
    npm install -g node-gyp-build
    ```

### Notes on Ubuntu 20.04 LTS ###
- [How to install Node.js 16 on Ubuntu 20.04 LTS](https://joshtronic.com/2021/05/09/how-to-install-nodejs-16-on-ubuntu-2004-lts/)
- [How to Run Linux Commands in Background](https://linuxize.com/post/how-to-run-linux-commands-in-background/)

## Configuration ##
1. Create or import 12-word mnemonics for
    1. Mainnet
    2. Ropsten
    3. Rinkeby
    4. Kovan
    5. Goerli
    6. Polygon
    7. Mumbai (Polygon Testnet)
    8. Binance Smart Chain (BSC) Mainnet
    9. BSC Testnet

    You can use MetaMask to create mnemonics: https://metamask.io/

    Note: you can use same mnemonic for test networks (ropsten, rinkeby, kovan, and goerli).
    Always use a separate one for mainnet, keep it secure.

    Note: you can add more configurations to connect to the networks not listed above.
    Check and add configurations required into the [hardhat.config.js](hardhat.config.js).

    Note: you can use private keys instead of mnemonics (see Alternative Configuration section below)

2. Create an infura access key at https://infura.io/

    Note: you can use alchemy API key instead of infura access key (see Alternative Configuration section below)

3. Create etherscan API key at https://etherscan.io/

4. Export mnemonics, infura access key, and etherscan API key as system environment variables
    (they should be available for hardhat):

    | Name         | Value                   |
    |--------------|-------------------------|
    | MNEMONIC1    | Mainnet mnemonic        |
    | MNEMONIC3    | Ropsten mnemonic        |
    | MNEMONIC4    | Rinkeby mnemonic        |
    | MNEMONIC42   | Kovan mnemonic          |
    | MNEMONIC5    | Goerli mnemonic         |
    | MNEMONIC137  | Polygon mnemonic        |
    | MNEMONIC80001| Mumbai mnemonic         |
    | MNEMONIC56   | BSC mnemonic            |
    | MNEMONIC97   | BSC Testnet mnemonic    |
    | INFURA_KEY   | Infura access key       |
    | ETHERSCAN_KEY| Etherscan API key       |
    | POLYSCAN_KEY | polygonscan API key     |
    | BSCSCAN_KEY  | BscScan API key         |

Note:  
Read [How do I set an environment variable?](https://www.schrodinger.com/kb/1842) article for more info on how to
set up environment variables in Linux, Windows and macOS.

### Example Script: macOS Catalina ###
```
export MNEMONIC1="witch collapse practice feed shame open despair creek road again ice least"
export MNEMONIC3="someone relief rubber remove donkey jazz segment nose spray century put beach"
export MNEMONIC4="someone relief rubber remove donkey jazz segment nose spray century put beach"
export MNEMONIC42="someone relief rubber remove donkey jazz segment nose spray century put beach"
export MNEMONIC5="someone relief rubber remove donkey jazz segment nose spray century put beach"
export MNEMONIC137="slush oyster cash hotel choice universe puzzle slot reflect sword intact fat"
export MNEMONIC80001="result mom hard lend adapt where result mule address ivory excuse embody"
export MNEMONIC56="slush oyster cash hotel choice universe puzzle slot reflect sword intact fat"
export MNEMONIC97="result mom hard lend adapt where result mule address ivory excuse embody"
export INFURA_KEY="000ba27dfb1b3663aadfc74c3ab092ae"
export ETHERSCAN_KEY="9GEEN6VPKUR7O6ZFBJEKCWSK49YGMPUBBG"
export POLYSCAN_KEY="VF9IZLVDRA03VE3K5S46EADMW6VNV0V73U"
export BSCSCAN_KEY="ZP0UMWCA2H12WKQKEK8OGAGZ6ZFL2D0S4C"
```

## Alternative Configuration: Using Private Keys instead of Mnemonics, and Alchemy instead if Infura ##
Alternatively to using mnemonics, private keys can be used instead.
When both mnemonics and private keys are set in the environment variables, private keys are used.

Similarly, alchemy can be used instead of infura.
If both infura and alchemy keys are set, alchemy is used.

1. Create or import private keys of the accounts for
    1. Mainnet
    2. Ropsten
    3. Rinkeby
    4. Kovan
    5. Goerli
    6. Polygon
    7. Mumbai (Polygon Testnet)
    8. Binance Smart Chain (BSC) Mainnet
    9. BSC Testnet

    You can use MetaMask to export private keys: https://metamask.io/

    Note: you can use the same private key for test networks (ropsten, rinkeby, kovan, and goerli).
    Always use a separate one for mainnet, keep it secure.

2. Create an alchemy API key at https://alchemy.com/

3. Create etherscan API key at https://etherscan.io/

4. Export private keys, infura access key, and etherscan API key as system environment variables
    (they should be available for hardhat):

    | Name         | Value                   |
    |--------------|-------------------------|
    | P_KEY1       | Mainnet private key     |
    | P_KEY3       | Ropsten private key     |
    | P_KEY4       | Rinkeby private key     |
    | P_KEY42      | Kovan private key       |
    | P_KEY5       | Goerli private key      |
    | P_KEY137     | Polygon private key     |
    | P_KEY80001   | Mumbai private key      |
    | P_KEY56      | BSC private key         |
    | P_KEY97      | BSC Testnet private key |
    | ALCHEMY_KEY  | Alchemy API key         |
    | ETHERSCAN_KEY| Etherscan API key       |
    | POLYSCAN_KEY | polygonscan API key     |
    | BSCSCAN_KEY  | BscScan API key         |

Note: private keys should start with ```0x```

### Example Script: macOS Catalina ###
```
export P_KEY1="0x5ed21858f273023c7fc0683a1e853ec38636553203e531a79d677cb39b3d85ad"
export P_KEY3="0xfb84b845b8ea672939f5f6c9a43b2ae53b3ee5eb8480a4bfc5ceeefa459bf20c"
export P_KEY4="0xfb84b845b8ea672939f5f6c9a43b2ae53b3ee5eb8480a4bfc5ceeefa459bf20c"
export P_KEY42="0xfb84b845b8ea672939f5f6c9a43b2ae53b3ee5eb8480a4bfc5ceeefa459bf20c"
export P_KEY5="0xfb84b845b8ea672939f5f6c9a43b2ae53b3ee5eb8480a4bfc5ceeefa459bf20c"
export P_KEY137="0x5ed21858f273023c7fc0683a1e853ec38636553203e531a79d677cb39b3d85ad"
export P_KEY80001="0xfb84b845b8ea672939f5f6c9a43b2ae53b3ee5eb8480a4bfc5ceeefa459bf20c"
export P_KEY56="0x5ed21858f273023c7fc0683a1e853ec38636553203e531a79d677cb39b3d85ad"
export P_KEY97="0xfb84b845b8ea672939f5f6c9a43b2ae53b3ee5eb8480a4bfc5ceeefa459bf20c"
export ALCHEMY_KEY="hLe1XqWAUlvmlW42Ka5fdgbpb97ENsMJ"
export ETHERSCAN_KEY="9GEEN6VPKUR7O6ZFBJEKCWSK49YGMPUBBG"
export POLYSCAN_KEY="VF9IZLVDRA03VE3K5S46EADMW6VNV0V73U"
export BSCSCAN_KEY="ZP0UMWCA2H12WKQKEK8OGAGZ6ZFL2D0S4C"
```

## Using Custom JSON-RPC Endpoint URL ##
To use custom JSON-RPC endpoint instead of infura/alchemy public endpoints, set the corresponding RPC URL as
an environment variable:

| Name            | Value                         |
|-----------------|-------------------------------|
| MAINNET_RPC_URL | Mainnet JSON-RPC endpoint URL |
| ROPSTEN_RPC_URL | Ropsten JSON-RPC endpoint URL |
| RINKEBY_RPC_URL | Rinkeby JSON-RPC endpoint URL |
| KOVAN_RPC_URL   | Kovan JSON-RPC endpoint URL   |
| GOERLI_RPC_URL  | Goerli JSON-RPC endpoint URL   |

## Compilation ##
Execute ```npx hardhat compile``` command to compile smart contracts.

Compilation settings are defined in [hardhat.config.js](./hardhat.config.js) ```solidity``` section.

Note: Solidity files *.sol use strict compiler version, you need to change all the headers when upgrading the
compiler to another version 

## Testing ##
Smart contract tests are built with Truffle – in JavaScript (ES6) and [web3.js](https://web3js.readthedocs.io/)

The tests are located in [test](./test) folder. 
They can be run with built-in [Hardhat Network](https://hardhat.org/hardhat-network/).

Run ```npx hardhat test``` to run all the tests or ```.npx hardhat test <test_file>``` to run individual test file.
Example: ```npx hardhat test ./test/erc721/erc721_zeppelin.js```

### Troubleshooting ###
* After running any test (executing ```npx hardhat test ./test/erc721/erc721_zeppelin.js``` for example) I get
    ```
    An unexpected error occurred:

    Error: This method only supports Buffer but input was: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    ```
    Fix: downgrade @nomiclabs/hardhat-truffle5 plugin to 2.0.0 (see https://issueexplorer.com/issue/nomiclabs/hardhat/1885)
    ```
    npm install -D @nomiclabs/hardhat-truffle5@2.0.0
    ```

## Test Coverage ##
Smart contracts test coverage is powered by [solidity-coverage] plugin.

Run `npx hardhat coverage` to run test coverage and generate the report.

### Troubleshooting ###
* After running the coverage I get
    ```
    <--- Last few GCs --->

    [48106:0x7f9b09900000]  3878743 ms: Scavenge 3619.3 (4127.7) -> 3606.1 (4128.2) MB, 5.2 / 0.0 ms  (average mu = 0.262, current mu = 0.138) task
    [48106:0x7f9b09900000]  3878865 ms: Scavenge 3620.6 (4128.2) -> 3606.9 (4129.2) MB, 4.9 / 0.0 ms  (average mu = 0.262, current mu = 0.138) allocation failure
    [48106:0x7f9b09900000]  3882122 ms: Mark-sweep 3619.5 (4129.2) -> 3579.6 (4128.4) MB, 3221.6 / 0.7 ms  (average mu = 0.372, current mu = 0.447) task scavenge might not succeed


    <--- JS stacktrace --->

    FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
     1: 0x10610e065 node::Abort() (.cold.1) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
     2: 0x104dabc19 node::Abort() [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
     3: 0x104dabd8f node::OnFatalError(char const*, char const*) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
     4: 0x104f29ef7 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, bool) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
     5: 0x104f29e93 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
     6: 0x1050f8be5 v8::internal::Heap::FatalProcessOutOfMemory(char const*) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
     7: 0x1050fccb6 v8::internal::Heap::RecomputeLimits(v8::internal::GarbageCollector) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
     8: 0x1050f94f6 v8::internal::Heap::PerformGarbageCollection(v8::internal::GarbageCollector, v8::GCCallbackFlags) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
     9: 0x1050f6c4d v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
    10: 0x105103dca v8::internal::Heap::AllocateRawWithLightRetrySlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
    11: 0x105103e51 v8::internal::Heap::AllocateRawWithRetryOrFailSlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
    12: 0x1050d425c v8::internal::Factory::NewFillerObject(int, bool, v8::internal::AllocationType, v8::internal::AllocationOrigin) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
    13: 0x10546fe0f v8::internal::Runtime_AllocateInYoungGeneration(int, unsigned long*, v8::internal::Isolate*) [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
    14: 0x105839d19 Builtins_CEntry_Return1_DontSaveFPRegs_ArgvOnStack_NoBuiltinExit [/usr/local/opt/nvm/versions/node/v16.4.0/bin/node]
    Abort trap: 6
    ```

    Fix: increase Node.js memory limit to 8 GB:
    ```
    export NODE_OPTIONS="--max-old-space-size=8192"
    ```

## Deployment ##
Deployments are implemented via [hardhat-deploy plugin](https://github.com/wighawag/hardhat-deploy) by Ronan Sandford.

Deployment scripts perform smart contracts deployment itself and their setup configuration.
Executing a script may require several transactions to complete, which may fail. To help troubleshoot
partially finished deployment, the scripts are designed to be rerunnable and execute only the transactions
which were not executed in previous run(s).

Deployment scripts are located under [deploy](./deploy) folder.
Deployment execution state is saved under [deployments](./deployments) folder.

To run fresh deployment (goerli):

1. Delete [deployments/goerli](./deployments/goerli) folder contents.

2. Run the deployment of interest with the ```npx hardhat deploy``` command
    ```
    npx hardhat deploy --network goerli --tags v1_deploy
    ```
    where ```v1_deploy``` specifies the deployment script tag to run,
    and ```--network goerli``` specifies the network to run script for
    (see [hardhat.config.js](./hardhat.config.js) for network definitions).

3. Verify source code on Etherscan with the ```npx hardhat etherscan-verify``` command
    ```
    npx hardhat etherscan-verify --network goerli
    ```

4. Enable the roles (see Access Control) required by the protocol
    ```
    npx hardhat deploy --network goerli --tags v1_roles
    ```
    Note: this step can be done via Etherscan UI manually

5. Enable the features (see Access Control) required by the protocol
    ```
    npx hardhat deploy --network goerli --tags v1_features
    ```
    Note: this step can be done via Etherscan UI manually

To rerun the deployment script and continue partially completed script skip the first step
(do not cleanup the [deployments](./deployments) folder).
