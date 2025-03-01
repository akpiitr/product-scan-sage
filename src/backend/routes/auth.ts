import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  // Handle login
  res.send('Login route');
});

router.post('/register', (req, res) => {
  // Handle registration
  res.send('Register route');
});

export default router;
