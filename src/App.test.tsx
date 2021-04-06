import { Atm } from "./atm"

test('Atm withdrawal', () => {
  const atm = new Atm()
  const payout = atm.withdraw(78)
  expect(payout).toStrictEqual({ '0050': 1, '0020': 1, '0005': 1, '0002': 1, '0001': 1 })
});

test('Atm withdrawal boxing', () => {
  const atm = new Atm()
  const payout = atm.withdraw(78)
  const payoutBoxes = atm.holdingToPayoutBoxes(payout)

  // We could remove undefined but it doesn't really matter for this example.
  expect(payoutBoxes).toStrictEqual({
    notes: {
      '1000': undefined,
      '0500': undefined,
      '0200': undefined,
      '0100': undefined,
      '0050': 1
    },
    largeCoins: { '0020': 1, '0005': 1, '0002': 1 },
    smallCoins: { '0010': undefined, '0001': 1 }
  })
});