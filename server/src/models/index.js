const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Review = require('./Review');
const Wishlist = require('./Wishlist');
const Payment = require('./Payment');

// User Associations
User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
User.hasMany(Order, { foreignKey: 'sellerId', as: 'sellerOrders' });
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlist' });
User.hasMany(Payment, { foreignKey: 'orderId', through: Order, as: 'payments' });
User.hasMany(Review, { foreignKey: 'moderatedBy', as: 'moderatedReviews' });

// Category Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Product Associations
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlistItems' });

// Order Associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' });

// OrderItem Associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Cart Associations
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });

// CartItem Associations
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Review Associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Review.belongsTo(User, { foreignKey: 'moderatedBy', as: 'moderator' });

// Wishlist Associations
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Payment Associations
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

module.exports = {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Review,
  Wishlist,
  Payment
}; 