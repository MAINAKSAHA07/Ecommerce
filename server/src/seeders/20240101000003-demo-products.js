'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [
      // Electronics Products
      {
        id: '770e8400-e29b-41d4-a716-446655440001',
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
        price: 89.99,
        comparePrice: 129.99,
        images: JSON.stringify([
          'https://via.placeholder.com/600x600/3B82F6/FFFFFF?text=Headphones+1',
          'https://via.placeholder.com/600x600/3B82F6/FFFFFF?text=Headphones+2',
          'https://via.placeholder.com/600x600/3B82F6/FFFFFF?text=Headphones+3'
        ]),
        categoryId: '660e8400-e29b-41d4-a716-446655440001',
        sellerId: '550e8400-e29b-41d4-a716-446655440002',
        stock: 50,
        sku: 'ELEC-HEAD-001',
        isActive: true,
        rating: 4.5,
        reviewCount: 128,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440002',
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and smartphone notifications. Track your health and stay connected.',
        price: 199.99,
        comparePrice: 249.99,
        images: JSON.stringify([
          'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Smart+Watch+1',
          'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Smart+Watch+2'
        ]),
        categoryId: '660e8400-e29b-41d4-a716-446655440001',
        sellerId: '550e8400-e29b-41d4-a716-446655440002',
        stock: 25,
        sku: 'ELEC-WATCH-001',
        isActive: true,
        rating: 4.3,
        reviewCount: 89,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440003',
        name: 'Laptop Stand with Cooling',
        description: 'Ergonomic laptop stand with built-in cooling fan. Improves posture and prevents overheating during long work sessions.',
        price: 45.99,
        comparePrice: 59.99,
        images: JSON.stringify([
          'https://via.placeholder.com/600x600/F59E0B/FFFFFF?text=Laptop+Stand+1',
          'https://via.placeholder.com/600x600/F59E0B/FFFFFF?text=Laptop+Stand+2'
        ]),
        categoryId: '660e8400-e29b-41d4-a716-446655440001',
        sellerId: '550e8400-e29b-41d4-a716-446655440003',
        stock: 75,
        sku: 'ELEC-STAND-001',
        isActive: true,
        rating: 4.7,
        reviewCount: 156,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440004',
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator lights.',
        price: 29.99,
        comparePrice: 39.99,
        images: JSON.stringify([
          'https://via.placeholder.com/600x600/EF4444/FFFFFF?text=Charging+Pad+1',
          'https://via.placeholder.com/600x600/EF4444/FFFFFF?text=Charging+Pad+2'
        ]),
        categoryId: '660e8400-e29b-41d4-a716-446655440001',
        sellerId: '550e8400-e29b-41d4-a716-446655440003',
        stock: 100,
        sku: 'ELEC-CHARG-001',
        isActive: true,
        rating: 4.2,
        reviewCount: 67,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Fashion Products
      {
        id: '770e8400-e29b-41d4-a716-446655440005',
        name: 'Premium Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt with modern fit. Available in multiple colors and sizes. Perfect for everyday wear.',
        price: 24.99,
        comparePrice: 34.99,
        images: JSON.stringify([
          'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=T-Shirt+1',
          'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=T-Shirt+2'
        ]),
        categoryId: '660e8400-e29b-41d4-a716-446655440002',
        sellerId: '550e8400-e29b-41d4-a716-446655440002',
        stock: 200,
        sku: 'FASH-TSHIRT-001',
        isActive: true,
        rating: 4.4,
        reviewCount: 234,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440006',
        name: 'Leather Crossbody Bag',
        description: 'Stylish leather crossbody bag with adjustable strap. Multiple compartments for organization. Perfect for daily use.',
        price: 79.99,
        comparePrice: 99.99,
        images: JSON.stringify([
          'https://via.placeholder.com/600x600/06B6D4/FFFFFF?text=Bag+1',
          'https://via.placeholder.com/600x600/06B6D4/FFFFFF?text=Bag+2'
        ]),
        categoryId: '660e8400-e29b-41d4-a716-446655440002',
        sellerId: '550e8400-e29b-41d4-a716-446655440003',
        stock: 30,
        sku: 'FASH-BAG-001',
        isActive: true,
        rating: 4.6,
        reviewCount: 89,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Home & Garden Products
      {
        id: '770e8400-e29b-41d4-a716-446655440007',
        name: 'Smart LED Light Bulb Set',
        description: 'WiFi-enabled smart LED bulbs with voice control. Change colors, set schedules, and control from your phone.',
        price: 49.99,
        comparePrice: 69.99,
        images: JSON.stringify([
          'https://via.placeholder.com/600x600/3B82F6/FFFFFF?text=LED+Bulb+1',
          'https://via.placeholder.com/600x600/3B82F6/FFFFFF?text=LED+Bulb+2'
        ]),
        categoryId: '660e8400-e29b-41d4-a716-446655440003',
        sellerId: '550e8400-e29b-41d4-a716-446655440002',
        stock: 60,
        sku: 'HOME-LED-001',
        isActive: true,
        rating: 4.8,
        reviewCount: 178,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440008',
        name: 'Garden Tool Set',
        description: 'Complete garden tool set with ergonomic handles. Includes trowel, pruner, weeder, and carrying case.',
        price: 39.99,
        comparePrice: 49.99,
        images: JSON.stringify([
          'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Garden+Tools+1',
          'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Garden+Tools+2'
        ]),
        categoryId: '660e8400-e29b-41d4-a716-446655440003',
        sellerId: '550e8400-e29b-41d4-a716-446655440003',
        stock: 40,
        sku: 'HOME-TOOLS-001',
        isActive: true,
        rating: 4.5,
        reviewCount: 92,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Products', products, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
}; 