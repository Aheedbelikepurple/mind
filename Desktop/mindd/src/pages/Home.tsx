import { Box, Typography, Button, Paper, Grid, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ExtensionIcon from '@mui/icons-material/Extension'
import Grid4x4Icon from '@mui/icons-material/Grid4x4'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

const ChessIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="60"
    height="60"
    fill="currentColor"
    style={{ transform: 'scale(1.2)' }}
  >
    {/* Chess King Crown */}
    <path d="M12 2L9 7h6L12 2z" />
    {/* Chess King Body */}
    <path d="M8 8h8v2H8z" />
    <path d="M7 10h10v2H7z" />
    <path d="M6 12h12v2H6z" />
    <path d="M5 14h14v2H5z" />
    <path d="M4 16h16v2H4z" />
    {/* Chess King Base */}
    <path d="M3 18h18v2H3z" />
    <path d="M2 20h20v2H2z" />
  </svg>
)

const Home = () => {
  const navigate = useNavigate()

  const games = [
    {
      name: 'Chess',
      description: 'Classic strategy game of kings and queens',
      icon: <ChessIcon />,
      path: '/chess',
      color: '#2E7D32' // Green
    },
    {
      name: 'Connect 4',
      description: 'Drop tokens and connect four to win',
      icon: <Grid4x4Icon sx={{ fontSize: 60 }} />,
      path: '/connect4',
      color: '#1976D2' // Blue
    },
    {
      name: 'Ultimate Tic Tac Toe',
      description: 'A strategic twist on the classic game',
      icon: <ExtensionIcon sx={{ fontSize: 60 }} />,
      path: '/ultimate-tictactoe',
      color: '#9C27B0' // Purple
    }
  ]

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 8,
      px: 2
    }}>
      <Stack spacing={6} alignItems="center">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 40 }} />
            Mind Games
            <AutoAwesomeIcon sx={{ fontSize: 40 }} />
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Challenge your mind with these classic strategy games
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 4,
          maxWidth: '1200px',
          width: '100%',
          mx: 'auto'
        }}>
          {games.map((game) => (
            <Paper
              key={game.name}
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                },
                background: `linear-gradient(145deg, ${game.color}15 0%, ${game.color}05 100%)`,
                border: `1px solid ${game.color}30`,
                borderRadius: 4
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  color: game.color,
                  background: `linear-gradient(145deg, ${game.color}15 0%, ${game.color}05 100%)`,
                  border: `2px solid ${game.color}30`
                }}
              >
                {game.icon}
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 2,
                  color: game.color
                }}
              >
                {game.name}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ mb: 3, flexGrow: 1 }}
              >
                {game.description}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(game.path)}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  background: game.color,
                  '&:hover': {
                    background: game.color,
                    opacity: 0.9
                  }
                }}
              >
                Play Now
              </Button>
            </Paper>
          ))}
        </Box>
      </Stack>
    </Box>
  )
}

export default Home 