import Url from '../models/Url.js';
import { generateCode } from '../utils/generateCode.js';
import {log} from '../../logging-middleware/logger.mjs';
import axios from 'axios';
const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';

export async function createShortUrl(req, res) {
  const { url, validity = 30, shortcode } = req.body;

  try {
    if (!url || typeof url !== 'string') {
      await log('backend', 'error', 'handler', 'Invalid or missing URL');
      return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    const validMinutes = parseInt(validity);
    if (isNaN(validMinutes) || validMinutes <= 0) {
      await log('backend', 'warn', 'handler', 'Invalid validity period');
      return res.status(400).json({ error: 'Invalid validity period' });
    }

    let code = shortcode || generateCode();
    let exists = await Url.findOne({ shortCode: code });

    if (exists) {
      await log('backend', 'error', 'handler', 'Shortcode already in use');
      return res.status(409).json({ error: 'Shortcode already in use' });
    }

    const expiryDate = new Date(Date.now() + validMinutes * 60 * 1000);
    const newUrl = new Url({ longUrl: url, shortCode: code, expiry: expiryDate });

    await newUrl.save();
    await log('backend', 'info', 'service', `Short URL created for ${url}`);

    res.status(201).json({
      shortLink: `${BASE_URL}/${code}`,
      expiry: expiryDate.toISOString()
    });
  } catch (err) {
    await log('backend', 'fatal', 'handler', `Failed to create short URL: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function redirectToLongUrl(req, res) {
  const { code } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortCode: code });
    if (!urlDoc) {
      await log('backend', 'warn', 'route', `Shortcode not found: ${code}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    if (new Date() > urlDoc.expiry) {
      await log('backend', 'warn', 'handler', `Shortcode expired: ${code}`);
      return res.status(410).json({ error: 'Shortcode expired' });
    }

    const referrer = req.get('Referer') || 'direct';
    const geoRes = await axios.get(`http://ip-api.com/json/`);
    const location = geoRes.data.country || 'unknown';

    urlDoc.clicks.push({ source: referrer, geo: location });
    await urlDoc.save();

    await log('backend', 'info', 'service', `Redirecting to original URL: ${urlDoc.longUrl}`);
    res.redirect(urlDoc.longUrl);
  } catch (err) {
    await log('backend', 'fatal', 'route', `Redirection error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getUrlStats(req, res) {
  const { code } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortCode: code });
    if (!urlDoc) {
      await log('backend', 'error', 'repository', `No stats found for shortcode: ${code}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    const stats = {
      longUrl: urlDoc.longUrl,
      shortCode: urlDoc.shortCode,
      createdAt: urlDoc.createdAt,
      expiry: urlDoc.expiry,
      totalClicks: urlDoc.clicks.length,
      clickData: urlDoc.clicks
    };

    await log('backend', 'info', 'service', `Stats retrieved for shortcode: ${code}`);
    res.json(stats);
  } catch (err) {
    await log('backend', 'fatal', 'service', `Failed to get stats: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
