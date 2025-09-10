import { PrismaClient, UserRole, ProductStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const brands = [
  'Shoei', 'Arai', 'Alpinestars', 'Dainese', 'AGV', 'HJC', 'Bell', 'Sena',
  'REV\'IT!', 'Klim', 'Icon', 'Fox Racing', 'Akrapovič', 'Yoshimura', 'Leatt', 'Troy Lee Designs'
];

const categories = [
  { name: 'Helmets', slug: 'helmets', children: ['Full Face', 'Modular', 'Open Face', 'Dual Sport'] },
  { name: 'Jackets', slug: 'jackets', children: ['Leather', 'Textile', 'Adventure'] },
  { name: 'Gloves', slug: 'gloves', children: ['Leather', 'Textile', 'Racing', 'Winter'] },
  { name: 'Boots', slug: 'boots', children: ['Racing', 'Casual', 'Touring', 'Adventure'] },
  { name: 'Pants', slug: 'pants', children: ['Leather', 'Textile', 'Jeans'] },
  { name: 'Protection', slug: 'protection', children: ['Armor', 'Back Protectors', 'Neck Braces'] },
  { name: 'Accessories', slug: 'accessories', children: ['Visors', 'Communication', 'Luggage'] }
];

// Helper function to create a unique slug
function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('Start seeding...');

  await deleteData();

  // 1. Create a System Admin User
  const password = await bcrypt.hash('tambykez-admin', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tambykez.com' },
    update: {},
    create: {
      email: 'admin@tambykez.com',
      firstName: 'System',
      lastName: 'Admin',
      password: password,
      role: UserRole.ADMIN,
      isActive: true,
      phone: '09171234567',
    },
  });
  console.log(`Created admin user with id: ${adminUser.id}`);

  // 2. Seed Brands
  const seededBrands = [];
  for (const brandName of brands) {
    const brandSlug = createSlug(brandName);
    const seededBrand = await prisma.brand.create({
      data: {
        name: brandName,
        slug: brandSlug,
        description: faker.lorem.sentence(),
        logo: `https://images.pexels.com/photos/10313460/pexels-photo-10313460.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300&dpr=2`, // Placeholder logo
      },
    });
    seededBrands.push(seededBrand);
    console.log(`Seeded brand: ${seededBrand.name}`);
  }

  // 3. Seed Categories
  const seededCategories = new Map();
  for (const cat of categories) {
    const parentCategory = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: faker.lorem.paragraph(),
        isActive: true,
      },
    });
    seededCategories.set(cat.name, parentCategory.id);

    if (cat.children) {
      for (const childName of cat.children) {
        const childCategory = await prisma.category.create({
          data: {
            name: `${cat.name} - ${childName}`,
            slug: createSlug(`${cat.name} ${childName}`),
            description: faker.lorem.paragraph(),
            parentId: parentCategory.id,
            isActive: true,
          },
        });
        seededCategories.set(childName, childCategory.id);
      }
    }
    console.log(`Seeded category: ${parentCategory.name}`);
  }

  // 4. Seed 100+ Products
  const createdProducts = [];
  const minProducts = 100;
  for (let i = 0; i < minProducts; i++) {
    const randomBrand = seededBrands[Math.floor(Math.random() * seededBrands.length)];
    const randomCategoryKey = faker.helpers.arrayElement(Array.from(seededCategories.keys()));
    const categoryId = seededCategories.get(randomCategoryKey);

    const productName = `${faker.commerce.productName()} ${faker.commerce.productAdjective()}`;
    const productSlug = createSlug(productName) + '-' + faker.string.uuid().slice(0, 8);
    const productPrice = faker.number.float({ min: 50, max: 1000, fractionDigits: 2 });

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: productSlug,
        description: faker.lorem.paragraphs(2),
        shortDescription: faker.lorem.sentence(),
        brandId: randomBrand.id,
        status: ProductStatus.ACTIVE,
        isFeatured: faker.datatype.boolean(),
        // Link to admin user for createdBy/updatedBy
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
        
        // Connect to categories
        categories: {
            create: {
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        },
      },
    });
    createdProducts.push(product);
    console.log(`Seeded product: ${product.name}`);

    // Create 3-5 variants for each product
    const variantCount = faker.number.int({ min: 3, max: 5 });
    for (let j = 0; j < variantCount; j++) {
      const variantName = faker.helpers.arrayElement(['Small', 'Medium', 'Large', 'Red', 'Black', 'Blue', 'White']);
      const variantSku = `${product.slug}-${faker.string.alphanumeric(6).toUpperCase()}`;
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: variantName,
          sku: variantSku,
          price: productPrice + faker.number.float({ min: -10, max: 20, fractionDigits: 2 }),
          inventory: faker.number.int({ min: 0, max: 100 }),
          size: variantName.match(/Small|Medium|Large/) ? variantName : null,
          color: variantName.match(/Red|Black|Blue|White/) ? variantName : null,
        },
      });
    }

    // Create 2-4 images for each product
    const imageCount = faker.number.int({ min: 2, max: 4 });
    for (let k = 0; k < imageCount; k++) {
      const imageUrl = `https://images.pexels.com/photos/${faker.number.int({ min: 1000, max: 9999999 })}/pexels-photo-${faker.number.int({ min: 1000, max: 9999999 })}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800&dpr=2`;
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl,
          altText: `${product.name} - Image ${k + 1}`,
          isMain: k === 0,
        },
      });
    }

    // Add a single review for a few products
    if (i % 5 === 0) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: adminUser.id,
          rating: faker.number.int({ min: 3, max: 5 }),
          title: faker.lorem.words(3),
          comment: faker.lorem.sentence(),
          isVerified: true,
          isApproved: true,
        },
      });
    }
  }

  console.log('Seeding finished.');
}

async function deleteData() {
  console.log('Deleting existing data...');

  // Delete in reverse order to respect foreign key constraints
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productCollection.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.productSEO.deleteMany();
  await prisma.productView.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.loginAttempt.deleteMany();
  await prisma.securityLog.deleteMany();
  await prisma.searchAnalytics.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.emailCampaignSubscriber.deleteMany();
  await prisma.emailSubscription.deleteMany();
  await prisma.emailCampaign.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.socialLogin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.file.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.taxRate.deleteMany();
  await prisma.shippingMethod.deleteMany();
  await prisma.shippingZone.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.analytics.deleteMany();
  await prisma.productQuestion.deleteMany();
  
  console.log('Existing data deleted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
