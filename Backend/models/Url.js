import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  source: String,
  geo: String
});

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clicks: [clickSchema]
});

export default mongoose.model('Url', urlSchema);