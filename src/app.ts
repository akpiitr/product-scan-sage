import express from 'express';
import healthCheckRouter from './routes/healthCheck';

const app = express();

app.use('/api', healthCheckRouter);
