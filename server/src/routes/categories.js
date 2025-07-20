const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get categories endpoint - not implemented yet' });
});

module.exports = router; 