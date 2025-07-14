import React, { useState } from 'react';
import {
  TextField, Button, Typography, Box, Card, CardContent, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import axios from 'axios';

const StatsPage = () => {
  const [shortcode, setShortcode] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    if (!shortcode.trim()) return;

    try {
      const response = await axios.get(`http://localhost:8000/shorturls/${shortcode}`);
      setStats(response.data);
      setError('');
    } catch (err) {
      setStats(null);
      setError(err.response?.data?.error || 'Error fetching stats');
    }
  };

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>Short URL Statistics</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Enter Shortcode"
          variant="outlined"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
        <Button variant="contained" onClick={fetchStats}>
          Get Stats
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body1">{error}</Typography>
      )}

      {stats && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography><strong>Original URL:</strong> <a href={stats.longUrl} target="_blank" rel="noreferrer">{stats.longUrl}</a></Typography>
              <Typography><strong>Shortcode:</strong> {stats.shortCode}</Typography>
              <Typography><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</Typography>
              <Typography><strong>Expires At:</strong> {new Date(stats.expiry).toLocaleString()}</Typography>
              <Typography><strong>Total Clicks:</strong> {stats.totalClicks}</Typography>
            </CardContent>
          </Card>

          <Typography variant="h6">Click Details</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Source (Referrer)</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.clickData.map((click, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{click.source}</TableCell>
                    <TableCell>{click.geo}</TableCell>
                  </TableRow>
                ))}
                {stats.clickData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No clicks recorded yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default StatsPage;
