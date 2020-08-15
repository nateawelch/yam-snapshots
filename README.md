# YAM delegation snapshot

Simple tool for generating list of all accounts and their underlying balances that were delegating for the Save YAM account at a specific block height

# Requirements
1. Node/npm
2. An Ethereum node that has all historic DelegateChanged events as well as state at the block height you want to snapshot. Not having either of these will cause the snapshot to have incorrect data.

# How to generate snapshot

  - Update the `JSON_RPC_URL` field in `config.js` to have an Ethereum node URL that satisfies the above requirements
  - `npm install` to install packages
  - `npm run build` to build this project
  - `npm start delegation blockNumber` to print out a snapshot. Replace `blockNumber` with the block you want to snapshot at. Leaving `blockNumber` blank will default it to the current block height

# How does it work?

1. Fetch all `DelegateChanged` events between [yamContractCreatedBlock, blockHeight] that have the Save YAM account as the target
2. Grab the delegator addresses from the events
3. Filter addresses by unique
4. Get the current delegate using `YamContract.delegates` of each delegator at the blockHeight
5. Filter accounts that are still delegating to proper delegate at proper blockHeight
6. Get the `YamContract.balanceOfUnderlying` of each account


# API

Aside from the CLI tool, you can also import the `YamDelegationSnapshotBuilder` class for usage in your own project. Calling `YamDelegationSnapshotBuilder.getDelegatedBalances(web3: Web3, blockHeight: string): Promise<Array<{address: string, balance: bigint}>>` will return the list of people that were properly delegated at that block height and their underlying balances (internal balances that are unaffected by rebases)
