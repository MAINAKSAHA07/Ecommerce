'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic gadgets and devices',
        image: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Electronics',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Fashion',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        image: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Home+Garden',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440004',
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and fitness gear',
        image: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Sports',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440005',
        name: 'Books',
        slug: 'books',
        description: 'Books, magazines, and educational materials',
        image: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Books',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440006',
        name: 'Toys & Games',
        slug: 'toys-games',
        description: 'Fun toys and games for all ages',
        image: 'https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Toys+Games',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
}; 