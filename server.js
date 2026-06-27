import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import blogRouter from './routes/blogs.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ status: 400, message: 'Malformed JSON payload' });
  }
  next(err);
});

app.use('/api/blogs', blogRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid blog ID format' });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog_db';
console.log('MONGO_URI:', mongoUri);

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection failed:', err.message));

app.listen(PORT, () => {
  console.log(`Server is actively running on port ${PORT}`);
});