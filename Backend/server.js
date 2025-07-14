import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import urlRoutes from './routes/urlRoutes.js';
import { log } from '../logging-middleware/logger.mjs';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/', urlRoutes);

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  log('backend', 'info', 'db', 'MongoDB connected successfully');
  app.listen(PORT, () => {
    log('backend', 'info', 'route', `Server running on port ${PORT}`);
  });
}).catch(err => {
  log('backend', 'fatal', 'db', `MongoDB connection error: ${err.message}`);
});
