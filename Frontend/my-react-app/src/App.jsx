import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import UrlForm from './components/UrlForm';
import UrlStats from './components/UrlStats';
<Route path="/stats" element={<UrlStats />} />
function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">Shorten</Button>
          <Button color="inherit" component={Link} to="/stats">Stats</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<UrlForm />} />
          <Route path="/stats" element={<UrlStats />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
