const sellerMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Seller access required'
      });
    }

    next();
  } catch (error) {
    console.error('Seller middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization failed'
    });
  }
};

module.exports = sellerMiddleware; 