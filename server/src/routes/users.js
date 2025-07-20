const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/profile', (req, res) => {
  res.status(501).json({ message: 'Get profile endpoint - not implemented yet' });
});

router.put('/profile', (req, res) => {
  res.status(501).json({ message: 'Update profile endpoint - not implemented yet' });
});

module.exports = router; 