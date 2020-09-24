import Web3 from 'web3'
import * as yargs from 'yargs'
import YamDelegationSnapshotBuilder from './YamDelegationSnapshotBuilder'
import YamUnderlyingBalanceSnapshotBuilder from './YamUnderlyingBalanceSnapshotBuilder'
import * as CONFIG from '../config'

yargs
  .scriptName("yam-snapshot-builder")
  .usage('$0 <cmd> [args]')
  .command('delegation [blockNumber]', 'Get snapshot of delegations', (yargs) => {
    yargs.positional('blockNumber', {
      type: 'string',
      default: 'latest',
      describe: 'block number to snapshot at'
    })
  }, async function (argv) {
    const yammers = await YamDelegationSnapshotBuilder.getDelegatedBalances(new Web3(CONFIG.JSON_RPC_URL), argv.blockNumber)
    let total = 0n
    yammers.forEach((yammer) => {
      total += yammer.balance
      console.log(yammer.address + '\t' + yammer.balance)
    })
    console.log("Total delegation: " + Number(total) / 10 ** 24)
    console.log("Total delegators: " + yammers.length)
  })
  .command('underlying [blockNumber]', 'Get snapshot of underlying balances', (yargs) => {
    yargs.positional('blockNumber', {
      type: 'string',
      default: 'latest',
      describe: 'block number to snapshot at'
    })
  }, async function (argv) {
    const yammers = await YamUnderlyingBalanceSnapshotBuilder.getBalances(new Web3(CONFIG.JSON_RPC_URL), argv.blockNumber)
    yammers.forEach((yammer) => {
      console.log(yammer.address + ',' + yammer.balanceOfUnderlying)
    })
  })
  .help()
  .argv
