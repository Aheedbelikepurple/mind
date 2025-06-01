import { useState, useEffect } from 'react'
import { Box, Typography, Button, Paper, Stack, Chip } from '@mui/material'
import { Chess, Square, Move } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import TimerIcon from '@mui/icons-material/Timer'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import HomeIcon from '@mui/icons-material/Home'
import { useNavigate } from 'react-router-dom'

const INITIAL_TIME = 10 * 60 // 10 minutes in seconds

const ChessGame = () => {
  const [game, setGame] = useState(new Chess())
  const [moveFrom, setMoveFrom] = useState<Square | ''>('')
  const [rightClickedSquares, setRightClickedSquares] = useState<Record<string, { backgroundColor: string }>>({})
  const [moveSquares, setMoveSquares] = useState<Record<string, { background: string; borderRadius: string }>>({})
  const [optionSquares, setOptionSquares] = useState<Record<string, { background: string; borderRadius: string }>>({})
  const [whiteTime, setWhiteTime] = useState(INITIAL_TIME)
  const [blackTime, setBlackTime] = useState(INITIAL_TIME)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[], black: string[] }>({ white: [], black: [] })
  const navigate = useNavigate()

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isGameStarted && !game.isGameOver()) {
      timer = setInterval(() => {
        if (game.turn() === 'w') {
          setWhiteTime(prev => Math.max(0, prev - 1))
        } else {
          setBlackTime(prev => Math.max(0, prev - 1))
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isGameStarted, game])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  function makeAMove(move: { from: Square; to: Square; promotion?: string }) {
    const gameCopy = new Chess(game.fen())
    try {
      const result = gameCopy.move(move)
      setGame(gameCopy)
      
      // Track captured pieces
      if (result.captured) {
        setCapturedPieces(prev => ({
          ...prev,
          [result.color === 'w' ? 'white' : 'black']: [
            ...prev[result.color === 'w' ? 'white' : 'black'],
            result.captured
          ]
        }))
      }
      
      return result
    } catch (error) {
      return null
    }
  }

  function onSquareClick(square: Square) {
    setRightClickedSquares({})

    // from square
    if (!moveFrom) {
      const moves = game.moves({
        square,
        verbose: true
      })
      if (moves.length === 0) {
        return
      }

      const newSquares: Record<string, { background: string; borderRadius: string }> = {}
      moves.map((move: Move) => {
        const piece = game.get(move.to)
        const fromPiece = game.get(square)
        if (piece && fromPiece) {
          // Capture move
          newSquares[move.to] = {
            background: 'rgba(255, 0, 0, 0.4)',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255, 0, 0, 0.4)'
          }
        } else {
          // Regular move
          newSquares[move.to] = {
            background: 'rgba(0, 0, 255, 0.4)',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0, 0, 255, 0.4)'
          }
        }
        return move
      })
      // Selected piece
      newSquares[square] = {
        background: 'rgba(255, 255, 0, 0.4)',
        borderRadius: '50%',
        boxShadow: '0 0 10px rgba(255, 255, 0, 0.4)'
      }
      setMoveSquares(newSquares)
      setMoveFrom(square)
      return
    }

    // to square
    if (!moveFrom) {
      return
    }

    const moves = game.moves({
      square: moveFrom,
      verbose: true
    })

    const foundMove = moves.find(
      (m: Move) => m.from === moveFrom && m.to === square
    )

    // invalid move
    if (!foundMove) {
      setMoveFrom('')
      setMoveSquares({})
      return
    }

    const move = makeAMove({
      from: moveFrom,
      to: square,
      promotion: 'q' // always promote to a queen for example simplicity
    })

    // if invalid, setMoveFrom and getMoveSquares are reset to empty
    if (!move) {
      setMoveFrom('')
      setMoveSquares({})
      return
    }

    setMoveFrom('')
    setMoveSquares({})
  }

  function onSquareRightClick(square: Square) {
    const colour = 'rgba(0, 0, 255, 0.4)'
    const newRightClickedSquares = { ...rightClickedSquares }
    if (rightClickedSquares[square]?.backgroundColor === colour) {
      delete newRightClickedSquares[square]
    } else {
      newRightClickedSquares[square] = { backgroundColor: colour }
    }
    setRightClickedSquares(newRightClickedSquares)
  }

  const resetGame = () => {
    setGame(new Chess())
    setMoveFrom('')
    setMoveSquares({})
    setOptionSquares({})
    setRightClickedSquares({})
    setWhiteTime(INITIAL_TIME)
    setBlackTime(INITIAL_TIME)
    setIsGameStarted(false)
    setCapturedPieces({ white: [], black: [] })
  }

  const startGame = () => {
    setIsGameStarted(true)
  }

  const getGameStatus = () => {
    if (whiteTime === 0) return 'Black wins by timeout!'
    if (blackTime === 0) return 'White wins by timeout!'
    if (game.isCheckmate()) return 'Checkmate!'
    if (game.isDraw()) return 'Draw!'
    if (game.isCheck()) return 'Check!'
    return game.turn() === 'w' ? "White's turn" : "Black's turn"
  }

  const getMoveHistory = () => {
    const history = game.history({ verbose: true })
    return history.slice(-5)
  }

  const renderCapturedPieces = (pieces: string[], color: 'white' | 'black') => {
    const pieceSymbols: Record<string, string> = {
      'p': '♟',
      'n': '♞',
      'b': '♝',
      'r': '♜',
      'q': '♛'
    }

    return (
      <Box sx={{ 
        minHeight: '40px',
        display: 'flex',
        gap: 0.5,
        flexWrap: 'wrap',
        alignItems: 'center',
        p: 1,
        bgcolor: color === 'white' ? 'grey.100' : 'grey.800',
        borderRadius: 1
      }}>
        {pieces.map((piece, index) => (
          <Typography 
            key={index}
            sx={{ 
              fontSize: '1.2rem',
              color: color === 'white' ? 'black' : 'white'
            }}
          >
            {pieceSymbols[piece.toLowerCase()]}
          </Typography>
        ))}
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
              Chess
            </Typography>
            <Box sx={{ width: 120 }} /> {/* Spacer for alignment */}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2,
              width: { xs: '100%', sm: '50%' }
            }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                White
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                bgcolor: 'rgba(255,255,255,0.1)',
                p: 1,
                borderRadius: 1
              }}>
                <TimerIcon sx={{ color: 'white' }} />
                <Typography variant="h5" sx={{ color: 'white', fontFamily: 'monospace' }}>
                  {formatTime(whiteTime)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2,
              width: { xs: '100%', sm: '50%' }
            }}>
              <Typography variant="h6" sx={{ color: 'black' }}>
                Black
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                bgcolor: 'rgba(0,0,0,0.1)',
                p: 1,
                borderRadius: 1
              }}>
                <TimerIcon sx={{ color: 'black' }} />
                <Typography variant="h5" sx={{ color: 'black', fontFamily: 'monospace' }}>
                  {formatTime(blackTime)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ 
            width: { xs: '100%', sm: '600px' },
            maxWidth: '100%',
            position: 'relative',
            '& .board-container': {
              width: '100%',
              height: 'auto',
              aspectRatio: '1/1',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }
          }}>
            <Chessboard
              animationDuration={200}
              boardOrientation="white"
              position={game.fen()}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
              customSquareStyles={{
                ...moveSquares,
                ...optionSquares,
                ...rightClickedSquares
              }}
            />
            <Box sx={{ 
              position: 'absolute',
              top: -30,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'background.paper',
              p: 1,
              borderRadius: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              gap: 2,
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255, 255, 0, 0.4)',
                  boxShadow: '0 0 10px rgba(255, 255, 0, 0.4)'
                }} />
                <Typography variant="caption">Selected</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(0, 0, 255, 0.4)',
                  boxShadow: '0 0 10px rgba(0, 0, 255, 0.4)'
                }} />
                <Typography variant="caption">Move</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255, 0, 0, 0.4)',
                  boxShadow: '0 0 10px rgba(255, 0, 0, 0.4)'
                }} />
                <Typography variant="caption">Capture</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: '50%' }
            }}>
              <Typography variant="subtitle1" sx={{ color: 'white' }}>
                Captured by White
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.5,
                minHeight: 30,
                bgcolor: 'rgba(255,255,255,0.1)',
                p: 1,
                borderRadius: 1,
                width: '100%'
              }}>
                {renderCapturedPieces(capturedPieces.white, 'white')}
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: '50%' }
            }}>
              <Typography variant="subtitle1" sx={{ color: 'black' }}>
                Captured by Black
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.5,
                minHeight: 30,
                bgcolor: 'rgba(0,0,0,0.1)',
                p: 1,
                borderRadius: 1,
                width: '100%'
              }}>
                {renderCapturedPieces(capturedPieces.black, 'black')}
              </Box>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {!isGameStarted ? (
              <Button 
                variant="contained" 
                onClick={startGame}
                startIcon={<PlayArrowIcon />}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Start Game
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={resetGame}
                startIcon={<StopIcon />}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Reset Game
              </Button>
            )}
          </Box>

          {getMoveHistory().length > 0 && (
            <Box sx={{ 
              width: '100%',
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                Recent Moves:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {getMoveHistory().map((move, index) => (
                  <Chip
                    key={index}
                    label={`${index + 1}. ${move.from} → ${move.to}`}
                    size="small"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  )
}

export default ChessGame 