import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography, Grid, Paper
} from '@mui/material';
import axios from 'axios';

const UrlForm = () => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [shortened, setShortened] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responses = await Promise.all(
        urls.map((entry) =>
          axios.post('http://localhost:8000/shorturls', {
            url: entry.longUrl,
            validity: parseInt(entry.validity) || undefined,
            shortcode: entry.shortcode || undefined
          })
        )
      );
      setShortened(responses.map((res) => res.data));
    } catch (err) {
      console.error(err);
      alert('An error occurred while shortening URLs.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {urls.map((entry, idx) => (
          <React.Fragment key={idx}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Original URL"
                value={entry.longUrl}
                onChange={(e) => handleChange(idx, 'longUrl', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Validity (minutes)"
                type="number"
                value={entry.validity}
                onChange={(e) => handleChange(idx, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Custom Shortcode (optional)"
                value={entry.shortcode}
                onChange={(e) => handleChange(idx, 'shortcode', e.target.value)}
              />
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button onClick={addField} disabled={urls.length >= 5}>
            + Add URL
          </Button>
          <Button type="submit" variant="contained" sx={{ ml: 2 }}>
            Shorten URLs
          </Button>
        </Grid>
      </Grid>

      {shortened.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened URLs:</Typography>
          {shortened.map((data, i) => (
            <Paper key={i} sx={{ p: 2, mt: 1 }}>
              <Typography>
                <strong>Short URL:</strong>{' '}
                <a href={data.shortLink} target="_blank" rel="noopener noreferrer">
                  {data.shortLink}
                </a>
              </Typography>
              <Typography>
                <strong>Expires At:</strong> {new Date(data.expiry).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UrlForm;
