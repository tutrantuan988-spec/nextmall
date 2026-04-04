const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Seed Coupons
  const coupons = [
    { code: '99SALE', discountAmount: 50000, expiryDate: new Date('2026-12-31'), isActive: true },
    { code: 'FREESHIP', discountAmount: 30000, expiryDate: new Date('2026-12-31'), isActive: true },
    { code: 'WELCOME', discountAmount: 100000, expiryDate: new Date('2026-12-31'), isActive: true },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon,
    });
  }

  // 2. Update some products with brands
  const brands = ['Apple', 'Samsung', 'Sony', 'Asus', 'Nike', 'Adidas'];
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    await prisma.product.update({
      where: { id: product.id },
      data: { brand: randomBrand }
    });
  }

  console.log('Seeding complete: Coupons and Brands updated.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
