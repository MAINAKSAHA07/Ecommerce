const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.post('/create-order', (req, res) => {
  res.status(501).json({ message: 'Create payment order endpoint - not implemented yet' });
});

router.post('/verify', (req, res) => {
  res.status(501).json({ message: 'Verify payment endpoint - not implemented yet' });
});

module.exports = router; 