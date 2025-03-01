import express from 'express';
import { checkDatabaseConnection } from '../services/databaseService';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const dbStatus = await checkDatabaseConnection();
    if (dbStatus) {
      res.status(200).json({ status: 'OK', database: 'Connected' });
    } else {
      res.status(500).json({ status: 'Error', database: 'Disconnected' });
    }
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

export default router;
