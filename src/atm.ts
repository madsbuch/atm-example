export type Tray = { [trayIdx: string]: number }
export type Boxes = {largeCoins: Tray, smallCoins: Tray, notes: Tray} | undefined

export class Atm {

  // Ensure lexicographical order ()
  holdings: Tray = {
    '1000': 10,
    '0500': 10,
    '0200': 10,
    '0100': 10,
    '0050': 10,
    '0020': 10,
    '0010': 10,
    '0005': 10,
    '0002': 10,
    '0001': 10
  }


  /**
   * Withdraw function
   * 
   * I think I remember that for the coin configuration used here, a valid
   * heuristic is to start from the most valuable and grab as many as possible.
   */
  withdraw (amount: number) {
    // Setup local state for a transaction. If an error happens, we implicitly
    // roll back
    const payout: {[trayIdx: string]: number} = {}
    const transaction = {...this.holdings}
    let tAmount = amount
    
    // Run through our holdings to add up numbers
    for(const trayIdx of Object.keys(transaction).sort().reverse()) {
      const trayAmount = Number(trayIdx)

      // Break out if the amount is too much
      while (trayAmount <= tAmount && transaction[trayIdx] > 0) {
        if (payout[trayIdx] === undefined) {
          payout[trayIdx] = 0
        }

        tAmount -= trayAmount
        transaction[trayIdx] -= 1
        payout[trayIdx] += 1
      }
    }

    // If we were not able to satisfy the request, then we break out
    if (tAmount > 0) {
      throw new Error("Could not pay out requested amount, aborting")
    }

    // Commit the new holdings and pay out
    this.holdings = transaction
    return payout
  }

  holdingToPayoutBoxes (holding: Tray): Boxes {
    return {
      notes: {
        '1000': holding['1000'],
        '0500': holding['0500'],
        '0200': holding['0200'],
        '0100': holding['0100'],
        '0050': holding['0050'],
      },
      largeCoins: {
        '0020': holding['0020'],
        '0005': holding['0005'],
        '0002': holding['0002'],
      },
      smallCoins: {
        '0010': holding['0010'],
        '0001': holding['0001']
      }
    }
  }
}
