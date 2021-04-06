import { useState } from 'react';
import './App.css';
import { Atm, Tray, Boxes } from './atm';

const TrayElement = (p: { amount: number, num: number }) => (
  <li key={p.num}>{p.num} of {p.amount}</li>
)

const Box = (p: {box: Tray}) => {
  const elements = Object.keys(p.box)
    .filter(trayIdx => p.box[trayIdx] !== undefined)
    .map(trayIdx => <TrayElement amount={Number(trayIdx)} num={p.box[trayIdx]} key={trayIdx} />)

  return (
    <ul>
      {elements}
    </ul>
  )
}

const BoxesElement = (p: {boxes: Boxes}) => {
  if (p.boxes !== undefined) {
    return (
      <div>
        <h2>Remember your money.</h2>
        <p>
          Notes:
        </p>
        <Box box={p.boxes.notes} />
        <p>
          Large Coins:
        </p>
        <Box box={p.boxes.largeCoins} />
        <p>
          Small Coins:
        </p>
        <Box box={p.boxes.smallCoins} />
      </div>
    )
  }
  return <div></div>
}

const atm = new Atm()

function App() {

  const [insufficientFunds, setInsufficientFunds] = useState(false)
  const [boxes, setBoxes] = useState<Boxes | undefined>(undefined)
  const [amount, setAmount] = useState(0);

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
    try {
      const payoutBoxes = atm.holdingToPayoutBoxes(atm.withdraw(amount))
      setBoxes(payoutBoxes)
      setInsufficientFunds(false)
    } catch (e) {
      // the only error that can be thrown is insufficient funds
      setInsufficientFunds(true)
      setBoxes(undefined)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Coin Bank Inc.</h1>
        <p>
          Enter the amount you wish to withdraw:
        </p>
        <form onSubmit={handleSubmit}>
          <input type="text" style={{ fontSize: "1.2em", padding: "10px" }} value={amount}
            onChange={e => setAmount(Number(e.target.value))} />
          <input type="submit" style={{ fontSize: "1.2em", padding: "10px" }} value="Withdraw!" />
        </form>

        {insufficientFunds && <p>Insufficient funds in the ATM</p>}
        <BoxesElement boxes={boxes} />

      </header>
    </div>
  );
}

export default App;
