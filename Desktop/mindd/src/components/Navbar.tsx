import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ 
            textDecoration: 'none', 
            color: 'white', 
            flexGrow: 1 
          }}
        >
          MultiGame Hub
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/chess">
            Chess
          </Button>
          <Button color="inherit" component={RouterLink} to="/connect4">
            Connect 4
          </Button>
          <Button color="inherit" component={RouterLink} to="/ultimate-tictactoe">
            Ultimate Tic Tac Toe
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar 