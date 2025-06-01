import { useState } from 'react'
import { Box, Typography, Button, Paper, Stack } from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import HomeIcon from '@mui/icons-material/Home'
import { useNavigate } from 'react-router-dom'

type Player = 'X' | 'O'
type BoardState = (Player | null)[][]
type GameState = (BoardState | null)[][]

const UltimateTicTacToe = () => {
  const navigate = useNavigate()
  const [gameState, setGameState] = useState<GameState>(Array(3).fill(null).map(() => 
    Array(3).fill(null).map(() => Array(3).fill(null).map(() => Array(3).fill(null)))
  ))
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [activeBoard, setActiveBoard] = useState<[number, number] | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)
  const [boardWinners, setBoardWinners] = useState<(Player | null)[][]>(Array(3).fill(null).map(() => Array(3).fill(null)))

  const checkBoardWinner = (board: BoardState): Player | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return board[i][0]
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return board[0][i]
      }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0]
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2]
    }

    return null
  }

  const checkGameWinner = (): Player | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (boardWinners[i][0] && boardWinners[i][0] === boardWinners[i][1] && boardWinners[i][1] === boardWinners[i][2]) {
        return boardWinners[i][0]
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (boardWinners[0][i] && boardWinners[0][i] === boardWinners[1][i] && boardWinners[1][i] === boardWinners[2][i]) {
        return boardWinners[0][i]
      }
    }

    // Check diagonals
    if (boardWinners[0][0] && boardWinners[0][0] === boardWinners[1][1] && boardWinners[1][1] === boardWinners[2][2]) {
      return boardWinners[0][0]
    }
    if (boardWinners[0][2] && boardWinners[0][2] === boardWinners[1][1] && boardWinners[1][1] === boardWinners[2][0]) {
      return boardWinners[0][2]
    }

    return null
  }

  const handleCellClick = (boardRow: number, boardCol: number, cellRow: number, cellCol: number) => {
    if (winner || !gameState[boardRow][boardCol] || boardWinners[boardRow][boardCol]) return
    if (activeBoard && (activeBoard[0] !== boardRow || activeBoard[1] !== boardCol)) return

    const newGameState = gameState.map(row => row.map(board => board ? [...board.map(cell => [...cell])] : null))
    if (!newGameState[boardRow][boardCol]) {
      newGameState[boardRow][boardCol] = Array(3).fill(null).map(() => Array(3).fill(null))
    }
    newGameState[boardRow][boardCol]![cellRow][cellCol] = currentPlayer

    // Check if the current board has a winner
    const boardWinner = checkBoardWinner(newGameState[boardRow][boardCol]!)
    const newBoardWinners = boardWinners.map(row => [...row])
    if (boardWinner) {
      newBoardWinners[boardRow][boardCol] = boardWinner
      setBoardWinners(newBoardWinners)
    }

    // Check if the game has a winner
    const gameWinner = checkGameWinner()
    if (gameWinner) {
      setWinner(gameWinner)
    }

    setGameState(newGameState)
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')

    // Set next active board
    const nextBoard = newBoardWinners[cellRow][cellCol] ? null : [cellRow, cellCol] as [number, number]
    setActiveBoard(nextBoard)
  }

  const resetGame = () => {
    setGameState(Array(3).fill(null).map(() => 
      Array(3).fill(null).map(() => Array(3).fill(null).map(() => Array(3).fill(null)))
    ))
    setCurrentPlayer('X')
    setActiveBoard(null)
    setWinner(null)
    setBoardWinners(Array(3).fill(null).map(() => Array(3).fill(null)))
  }

  const renderCell = (boardRow: number, boardCol: number, cellRow: number, cellCol: number) => {
    const value = gameState[boardRow][boardCol]?.[cellRow][cellCol]
    const isActive = !activeBoard || (activeBoard[0] === boardRow && activeBoard[1] === boardCol)
    const isBoardWon = boardWinners[boardRow][boardCol]

    return (
      <Box
        key={`${boardRow}-${boardCol}-${cellRow}-${cellCol}`}
        onClick={() => handleCellClick(boardRow, boardCol, cellRow, cellCol)}
        sx={{
          width: 40,
          height: 40,
          border: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isActive && !isBoardWon ? 'pointer' : 'default',
          bgcolor: isActive ? 'white' : 'grey.100',
          '&:hover': {
            bgcolor: isActive && !isBoardWon ? 'grey.100' : undefined
          }
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: value === 'X' ? '#1976D2' : '#D32F2F',
            fontWeight: 'bold'
          }}
        >
          {value}
        </Typography>
      </Box>
    )
  }

  const renderBoard = (boardRow: number, boardCol: number) => {
    const boardWinner = boardWinners[boardRow][boardCol]
    const isActive = !activeBoard || (activeBoard[0] === boardRow && activeBoard[1] === boardCol)

    return (
      <Box
        key={`${boardRow}-${boardCol}`}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0.5,
          p: 0.5,
          bgcolor: isActive ? '#E3F2FD' : 'white',
          borderRadius: 1,
          border: '2px solid',
          borderColor: isActive ? '#1976D2' : 'transparent'
        }}
      >
        {boardWinner ? (
          <Box
            sx={{
              gridColumn: '1 / -1',
              gridRow: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: boardWinner === 'X' ? '#E3F2FD' : '#FFEBEE'
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: boardWinner === 'X' ? '#1976D2' : '#D32F2F',
                fontWeight: 'bold'
              }}
            >
              {boardWinner}
            </Typography>
          </Box>
        ) : (
          Array(3).fill(null).map((_, cellRow) =>
            Array(3).fill(null).map((_, cellCol) =>
              renderCell(boardRow, boardCol, cellRow, cellCol)
            )
          )
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 8,
      px: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4
    }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(145deg, #1976D215 0%, #1976D205 100%)',
          border: '1px solid #1976D230'
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              startIcon={<HomeIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                borderColor: '#1976D2',
                color: '#1976D2',
                '&:hover': {
                  borderColor: '#1565C0',
                  bgcolor: '#1976D210'
                }
              }}
            >
              Back to Home
            </Button>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: '#1976D2',
              }}
            >
              Ultimate Tic Tac Toe
            </Typography>
            <Box sx={{ width: 120 }} /> {/* Spacer for alignment */}
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            p: 2,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            {Array(3).fill(null).map((_, boardRow) =>
              Array(3).fill(null).map((_, boardCol) =>
                renderBoard(boardRow, boardCol)
              )
            )}
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            {winner ? (
              <Typography 
                variant="h5" 
                sx={{
                  color: winner === 'X' ? '#1976D2' : '#D32F2F',
                  fontWeight: 'bold'
                }}
              >
                Player {winner} wins!
              </Typography>
            ) : (
              <Typography 
                variant="h5" 
                sx={{ 
                  color: currentPlayer === 'X' ? '#1976D2' : '#D32F2F',
                  fontWeight: 'bold'
                }}
              >
                Player {currentPlayer}'s turn
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={resetGame}
            startIcon={<RestartAltIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              bgcolor: '#1976D2',
              '&:hover': {
                bgcolor: '#1565C0'
              }
            }}
          >
            Reset Game
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default UltimateTicTacToe 