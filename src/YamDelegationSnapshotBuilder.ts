import Web3 from 'web3'
import CONSTANTS from './Constants'

import Bluebird from 'bluebird'

export default class YamDelegationSnapshotBuilder {
  private readonly blockHeight: string
  private readonly yamContract

  private constructor(blockHeight: string, yamContract) {
    this.blockHeight = blockHeight
    this.yamContract = yamContract
  }

  private async getTrueYammers(): Promise<Array<IYammer>> {
    // Get all approval events targeting the delegate
    const delegateEvents = await this.yamContract.getPastEvents('DelegateChanged', {
      fromBlock: CONSTANTS.CONTRACT_CREATED_BLOCK,
      toBlock: this.blockHeight,
      filter: {
        toDelegate: [CONSTANTS.DELEGATE]
      }
    })
    // Get addresses only
    let delegators = delegateEvents.map((event) => { return event.returnValues.delegator })
    // Filter by unique
    delegators = delegators.filter((value, index, self) => { return self.indexOf(value) === index; })
    // Get the delegator's delegate at the snapshot block height
    delegators = await Bluebird.map(delegators, async (delegator) => {
      let delegate
      try {
        delegate = await this.yamContract.methods.delegates(delegator).call(undefined, this.blockHeight)
      } catch (e) {
        console.log(`Failure getting delegate for delegator ${delegator}`)
        throw e
      }
      return { delegator, delegate }
    }, {
      concurrency: 100
    })
    // Filter by users that are delegating to the delegate at the snapshot height
    delegators = delegators.filter((delegator: any) => delegator.delegate.toLowerCase() === CONSTANTS.DELEGATE)

    // Get balances and return Yammers

    return await Bluebird.map(delegators, async (delegator: any): Promise<IYammer> => {
      let balance
      try {
        balance = BigInt(await this.yamContract.methods.balanceOfUnderlying(delegator.delegator).call(undefined, this.blockHeight))
      } catch (e) {
        console.log(`Failure getting balance for delegator ${delegator.delegator}`)
        throw e
      }
      return { address: delegator.delegator, balance }
    }, { concurrency: 100 }).filter((yammer: IYammer): boolean => { return yammer.balance > 0n })
  }


  public static async getDelegatedBalances(web3: Web3, blockHeight: string): Promise<Array<IYammer>> {
    const yamContract = new web3.eth.Contract(CONSTANTS.YAM_ABI, CONSTANTS.YAM_ADDRESS)
    return new YamDelegationSnapshotBuilder(blockHeight, yamContract).getTrueYammers()
  }
}


interface IYammer {
  address: string
  balance: bigint
}