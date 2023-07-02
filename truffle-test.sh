#!/usr/bin/env bash

# cleanup compiled contracts dir (optional)
# rm -rf build
# start Ganache CLI detached
ganache-cli\
  --host=localhost\
  --port=8666\
  --networkId=0xeeeb04de\
  --defaultBalanceEther=10000\
  --gasPrice=1\
  --gasLimit=0xffffffff\
  --accounts=35\
  --deterministic\
  > testrpc.log 2>&1 &

# run tests
truffle test --network=test "$@" # --stacktrace-extra truffle flag breaks Zeppelin expectRevert.unspecified

# kill detached Ganache CLI process
kill $(lsof -t -i :8666)
