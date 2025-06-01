import { useState } from 'react'
import { Box, Button, Paper, Typography, Stack, IconButton } from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import HomeIcon from '@mui/icons-material/Home'
import { useNavigate } from 'react-router-dom'
import { keyframes } from '@mui/system'

const ROWS = 6
const COLS = 7
const WIN_LENGTH = 4

type PlayerNumber = 1 | 2

// Color options for players
const PLAYER_COLORS: Record<PlayerNumber, Array<{ name: string; value: string }>> = {
  1: [
    { name: 'Red', value: '#f44336' },
    { name: 'Purple', value: '#9c27b0' },
    { name: 'Pink', value: '#e91e63' },
    { name: 'Orange', value: '#ff9800' }
  ],
  2: [
    { name: 'Yellow', value: '#ffeb3b' },
    { name: 'Green', value: '#4caf50' },
    { name: 'Blue', value: '#2196f3' },
    { name: 'Teal', value: '#009688' }
  ]
}

// Animation keyframes
const dropAnimation = keyframes`
  0% {
    transform: translateY(-400px);
    opacity: 0;
  }
  60% {
    transform: translateY(20px);
    opacity: 1;
  }
  80% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0,0,0,0.4);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(0,0,0,0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0,0,0,0);
  }
`

const Connect4 = () => {
  const navigate = useNavigate()
  const [board, setBoard] = useState<number[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)))
  const [currentPlayer, setCurrentPlayer] = useState<PlayerNumber>(1)
  const [winner, setWinner] = useState<PlayerNumber | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [playerColors, setPlayerColors] = useState<Record<PlayerNumber, string>>({
    1: PLAYER_COLORS[1][0].value,
    2: PLAYER_COLORS[2][0].value
  })
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null)

  const checkWin = (row: number, col: number, player: PlayerNumber): boolean => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
    ]

    return directions.some(([dx, dy]) => {
      let count = 1
      
      // Check forward direction
      for (let i = 1; i < WIN_LENGTH; i++) {
        const newRow = row + dx * i
        const newCol = col + dy * i
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          count++
        } else {
          break
        }
      }

      // Check backward direction
      for (let i = 1; i < WIN_LENGTH; i++) {
        const newRow = row - dx * i
        const newCol = col - dy * i
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          count++
        } else {
          break
        }
      }

      return count >= WIN_LENGTH
    })
  }

  const handleColumnClick = (col: number) => {
    if (gameOver) return

    // Find the lowest empty row in the selected column
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === 0) {
        const newBoard = board.map(row => [...row])
        newBoard[row][col] = currentPlayer
        setBoard(newBoard)
        setLastMove({ row, col })

        // Check for win
        if (checkWin(row, col, currentPlayer)) {
          setWinner(currentPlayer)
          setGameOver(true)
          return
        }

        // Check for draw
        if (newBoard.every(row => row.every(cell => cell !== 0))) {
          setGameOver(true)
          return
        }

        // Switch player
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
        return
      }
    }
  }

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)))
    setCurrentPlayer(1)
    setWinner(null)
    setGameOver(false)
    setLastMove(null)
  }

  const changePlayerColor = (player: PlayerNumber, color: string) => {
    setPlayerColors(prev => ({
      ...prev,
      [player]: color
    }))
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
              Connect 4
            </Typography>
            <Box sx={{ width: 120 }} /> {/* Spacer for alignment */}
          </Box>

          {/* Color Selection */}
          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            {([1, 2] as const).map((player) => (
              <Box key={player} sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Player {player} Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {PLAYER_COLORS[player].map((color) => (
                    <IconButton
                      key={color.value}
                      onClick={() => changePlayerColor(player, color.value)}
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: color.value,
                        border: `2px solid ${playerColors[player] === color.value ? '#000' : 'transparent'}`,
                        '&:hover': {
                          bgcolor: color.value,
                          opacity: 0.8
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: 1,
            p: 2,
            bgcolor: '#1976D2',
            borderRadius: 2,
            position: 'relative'
          }}>
            {board.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <Box
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleColumnClick(colIndex)}
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: gameOver ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: gameOver ? 'white' : '#f0f0f0'
                    }
                  }}
                >
                  {cell !== 0 && (
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: playerColors[cell as PlayerNumber],
                        transition: 'all 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        animation: lastMove?.row === rowIndex && lastMove?.col === colIndex
                          ? `${dropAnimation} 0.5s ease-out`
                          : 'none',
                        ...(winner && cell === winner && {
                          animation: `${pulseAnimation} 1s infinite`,
                          boxShadow: `0 0 20px ${playerColors[cell as PlayerNumber]}`
                        })
                      }}
                    />
                  )}
                </Box>
              ))
            ))}
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            {winner ? (
              <Typography 
                variant="h5" 
                sx={{
                  color: playerColors[winner],
                  fontWeight: 'bold',
                  textShadow: `0 0 10px ${playerColors[winner]}40`
                }}
              >
                Player {winner} wins!
              </Typography>
            ) : gameOver ? (
              <Typography variant="h5" color="text.secondary">
                It's a draw!
              </Typography>
            ) : (
              <Typography 
                variant="h5" 
                sx={{ 
                  color: playerColors[currentPlayer],
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

export default Connect4 