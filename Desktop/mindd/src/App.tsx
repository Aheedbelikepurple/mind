import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chess from './pages/Chess'
import Connect4 from './pages/Connect4'
import UltimateTicTacToe from './pages/UltimateTicTacToe'
import theme from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box minHeight="100vh" bgcolor="grey.50">
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chess" element={<Chess />} />
              <Route path="/connect4" element={<Connect4 />} />
              <Route path="/ultimate-tictactoe" element={<UltimateTicTacToe />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App
