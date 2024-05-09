import { Square } from './components/Square.jsx'
import { TURNS } from './constans.js';
import { checkWinnerFrom, checkEndGame } from './logic/board.js';
import { WinnerModal } from './components/WinnerModal.jsx';

import { useState } from 'react'
import './App.css'

function App() {
  const [board, setBoard] = useState( () =>{
    const boardFromLocalStorage = localStorage.getItem('board')
    return boardFromLocalStorage ? JSON.parse(boardFromLocalStorage) : Array(9).fill(null)
  });
  
  const [turn, setTurn] = useState(() => {
    const turnFromLocalStorage = localStorage.getItem('turn');
    return turnFromLocalStorage ?? TURNS.x
  });

  const [winer, setWiner] = useState(null)

  const updateBoard = (index) => {
    if(board[index] || winer) return
    const newBoard = [...board];
    newBoard[index] = turn
    setBoard(newBoard);

    const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x;
    setTurn(newTurn);

    window.localStorage.setItem('board', JSON.stringify(newBoard));
    window.localStorage.setItem('turn', turn);

    const newWinner = checkWinnerFrom(newBoard)
    if(newWinner) {
      //alert('El ganador es ' + newWinner)
      setWiner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWiner(false)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.x);
    setWiner(null);

    window.localStorage.removeItem('board');
    window.localStorage.removeItem('turn');
  }

  return (
    <main className='board'>
      <h1>Gato</h1>
      <button onClick={resetGame}>Empezar de nuevo</button>
      <section className='game'>
        {
          board.map((square, index)=>{
            return(
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                  {square}
              </Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.x}>{TURNS.x}</Square>
        <Square isSelected={turn === TURNS.o}>{TURNS.o}</Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winer}></WinnerModal>
    </main>
  )
}

export default App
