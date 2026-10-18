import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '2mb' }));
app.get('/', (_, res) => res.send('Resume API running'));
app.use('/api', routes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('API ready')))
  .catch((e) => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
