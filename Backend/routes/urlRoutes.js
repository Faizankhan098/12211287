import express from 'express';
import {
  createShortUrl,
  redirectToLongUrl,
  getUrlStats
} from '../controllers/urlController.js';

const router = express.Router();

// All short URL operations are under /shorturls
router.post('/shorturls', createShortUrl);
router.get('/shorturls/:code', getUrlStats);

// Redirection route must come *after* and be outside that prefix
router.get('/:code', redirectToLongUrl);

export default router;
