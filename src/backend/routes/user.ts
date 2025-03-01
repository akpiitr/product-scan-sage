import express from 'express';

const router = express.Router();

router.get('/:id', (req, res) => {
  // Get user data by ID
  res.send(`User data for ID: ${req.params.id}`);
});

router.put('/:id', (req, res) => {
  // Update user data by ID
  res.send(`Update user data for ID: ${req.params.id}`);
});

export default router;
