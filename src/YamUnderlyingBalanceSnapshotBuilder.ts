import Web3 from 'web3'
import CONSTANTS from './Constants'

import Bluebird from 'bluebird'

export default class YamUnderlyingBalanceSnapshotBuilder {
  private readonly blockHeight: string
  private readonly yamContract

  private constructor(blockHeight: string, yamContract) {
    this.blockHeight = blockHeight
    this.yamContract = yamContract
  }

  private async getBalances(): Promise<Array<IYammer>> {
    // Get all Transfer events
    const transferEvents = await this.getTransferEvents()
    // Get addresses only
    let yammers = transferEvents.map((event) => { return event.returnValues.to })
    // Filter by unique
    yammers = yammers.filter((value, index, self) => { return self.indexOf(value) === index; })
    console.log(yammers)
    // Get balances and return Yammers
    return await Bluebird.map(yammers, async (to: any): Promise<IYammer> => {
      let balance
      try {
        balance = BigInt(await this.yamContract.methods.balanceOfUnderlying(to).call(undefined, this.blockHeight))
      } catch (e) {
        console.log(`Failure getting balance for to ${to}`)
        throw e
      }
      return { address: to, balanceOfUnderlying: balance }
    }, { concurrency: 500 }).filter((yammer: IYammer): boolean => { return yammer.balanceOfUnderlying > 0n })
  }

  private async getTransferEvents(): Promise<Array<any>> {
    let finishBlock = parseInt(this.blockHeight)
    let currentBlock = CONSTANTS.CONTRACT_CREATED_BLOCK
    let events = []
    let blockNumbers = []
    while (currentBlock < finishBlock) {
      blockNumbers.push(currentBlock)
      currentBlock += 250
    }
    await Bluebird.map(blockNumbers, async (blockNumber: number): Promise<void> => {

      let rangeEvents = await this.yamContract.getPastEvents('Transfer', {
        fromBlock: blockNumber,
        toBlock: blockNumber + 250
      })
      events.push(...rangeEvents)
    }, { concurrency: 200 })

    return events
  }
  public static async getBalances(web3: Web3, blockHeight: string): Promise<Array<IYammer>> {
    const yamContract = new web3.eth.Contract(CONSTANTS.YAM_ABI, CONSTANTS.YAM_ADDRESS)
    return new YamUnderlyingBalanceSnapshotBuilder(blockHeight, yamContract).getBalances()
  }

}


interface IYammer {
  address: string
  balanceOfUnderlying: bigint
}
