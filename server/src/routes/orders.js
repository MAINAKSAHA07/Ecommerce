const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get orders endpoint - not implemented yet' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create order endpoint - not implemented yet' });
});

module.exports = router; 