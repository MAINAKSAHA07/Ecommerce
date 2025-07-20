'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'admin@ecommerce.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        emailVerified: true,
        phone: '+1234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'seller1@ecommerce.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Seller',
        role: 'seller',
        isActive: true,
        emailVerified: true,
        phone: '+1234567891',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'seller2@ecommerce.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Merchant',
        role: 'seller',
        isActive: true,
        emailVerified: true,
        phone: '+1234567892',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        email: 'customer1@ecommerce.com',
        password: hashedPassword,
        firstName: 'Mike',
        lastName: 'Customer',
        role: 'customer',
        isActive: true,
        emailVerified: true,
        phone: '+1234567893',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        email: 'customer2@ecommerce.com',
        password: hashedPassword,
        firstName: 'Lisa',
        lastName: 'Buyer',
        role: 'customer',
        isActive: true,
        emailVerified: true,
        phone: '+1234567894',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
}; 