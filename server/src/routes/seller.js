const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/dashboard', (req, res) => {
  res.status(501).json({ message: 'Seller dashboard endpoint - not implemented yet' });
});

module.exports = router; 