"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const CATEGORIES = [
    {
        name: 'Phones',
        brands: ['Apple', 'Samsung', 'Google', 'Xiaomi', 'Oppo'],
        images: [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
            'https://images.unsplash.com/photo-1610945415295-d9bca0f647c0',
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
            'https://images.unsplash.com/photo-1592890288564-76628a30a657',
            'https://images.unsplash.com/photo-1567581935884-3349723552ca',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
            'https://images.unsplash.com/photo-1556656793-062ff987b50d',
            'https://images.unsplash.com/photo-1533228891584-483603415ceb',
            'https://images.unsplash.com/photo-1520923179270-e0a53aa48e24',
            'https://images.unsplash.com/photo-1509741102003-ca64bfe5f069'
        ],
        productNames: [
            'iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'Google Pixel 8 Pro', 'Xiaomi 14 Ultra', 'Oppo Find X7 Ultra',
            'iPhone 14 Plus', 'Samsung Galaxy Z Fold 5', 'Google Pixel 7a', 'Xiaomi Redmi Note 13', 'Oppo Reno 11'
        ]
    },
    {
        name: 'Computers',
        brands: ['Apple', 'Dell', 'Asus', 'HP', 'Lenovo'],
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
            'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
            'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5',
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
            'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
            'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'
        ],
        productNames: [
            'MacBook Pro M3 Max', 'Dell XPS 15', 'ASUS ROG Zephyrus G14', 'HP Spectre x360', 'Lenovo ThinkPad X1 Carbon',
            'MacBook Air M2', 'Dell Alienware m18', 'ASUS Vivobook 16', 'HP Pavilion 15', 'Lenovo Yoga 9i'
        ]
    },
    {
        name: 'Watches',
        brands: ['Rolex', 'Casio', 'Apple', 'Garmin', 'Seiko'],
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
            'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6',
            'https://images.unsplash.com/photo-1508685096489-7aac29bbbd0b',
            'https://images.unsplash.com/photo-1539533377285-36478f470c3d',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3',
            'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7',
            'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a',
            'https://images.unsplash.com/photo-1619134704035-1329241b777a',
            'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5'
        ],
        productNames: [
            'Apple Watch Ultra 2', 'Casio G-Shock GA-2100', 'Rolex Submariner Date', 'Garmin Fenix 7 Pro', 'Seiko SKX007',
            'Apple Watch Series 9', 'Casio F-91W', 'Rolex Daytona Gold', 'Garmin Forerunner 965', 'Seiko Presage SRPD'
        ]
    },
    {
        name: 'Fashion',
        brands: ['Nike', 'Zara', 'Adidas', 'Uniqlo', 'Gucci'],
        images: [
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
            'https://images.unsplash.com/photo-1543076447-215ad9ba6923',
            'https://images.unsplash.com/photo-1505022610485-0249ba5ec3cd',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
            'https://images.unsplash.com/photo-1603217192634-61068e4d4bf9',
            'https://images.unsplash.com/photo-1516762689617-e1cffcef479d',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
            'https://images.unsplash.com/photo-1491637639811-60a3156eddf9'
        ],
        productNames: [
            'Nike Air Force 1', 'Zara Oversized Hoodie', 'Adidas Tiro 23 Pants', 'Uniqlo Airism T-Shirt', 'Gucci GG Belt',
            'Nike Tech Fleece', 'Zara Denim Jacket', 'Adidas Ultraboost 1.0', 'Uniqlo Heattech Innerwaer', 'Gucci Silk Scarf'
        ]
    },
    {
        name: 'Home Appliances',
        brands: ['LG', 'Samsung', 'Panasonic', 'Dyson', 'Philips'],
        images: [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
            'https://images.unsplash.com/photo-1585515320310-259814833e62',
            'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9',
            'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257',
            'https://images.unsplash.com/photo-1556020685-ae41abfc9365',
            'https://images.unsplash.com/photo-1550989460-0adf9ea622e2',
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
            'https://images.unsplash.com/photo-1556911220-e15595bb68c3',
            'https://images.unsplash.com/photo-1588854334442-60af0bc3826c',
            'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9'
        ],
        productNames: [
            'Dyson V15 Detect Vacuum', 'LG OLED C3 65"', 'Samsung Bespoke Fridge', 'Panasonic Microwave Oven', 'Philips Air Fryer XXL',
            'Dyson Pure Cool TP07', 'LG TurboWash 360', 'Samsung Neo QLED 8K', 'Panasonic Nanoe Hair Dryer', 'Philips Hue Smart Light'
        ]
    },
    {
        name: 'Gaming',
        brands: ['Sony', 'Nintendo', 'Razer', 'Logitech', 'Microsoft'],
        images: [
            'https://images.unsplash.com/photo-1606220838315-056192d5e927',
            'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8',
            'https://images.unsplash.com/photo-1542751371-adc38448a05e',
            'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf',
            'https://images.unsplash.com/photo-1538481199705-c710c4e965fc',
            'https://images.unsplash.com/photo-1598550476439-6847785fce6e',
            'https://images.unsplash.com/photo-1606220838315-056192d5e927',
            'https://images.unsplash.com/photo-1509198397868-475647b2a1e5',
            'https://images.unsplash.com/photo-1621259182978-f09e5e2ca84a',
            'https://images.unsplash.com/photo-1509198397868-475647b2a1e5'
        ],
        productNames: [
            'PlayStation 5 Console', 'Nintendo Switch OLED', 'Razer Viper V3 Pro', 'Logitech G502 X Plus', 'Xbox Series X',
            'Steam Deck OLED 512GB', 'Razer Huntsman V3 Pro', 'Logitech G Pro X 2', 'Nintendo Switch Lite', 'PS5 DualSense Edge'
        ]
    },
    {
        name: 'Cameras',
        brands: ['Canon', 'Sony', 'Nikon', 'Fujifilm', 'GoPro'],
        images: [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
            'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c',
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd',
            'https://images.unsplash.com/photo-1563544605934-d3600e5728a3',
            'https://images.unsplash.com/photo-1519741497674-611481863552',
            'https://images.unsplash.com/photo-1516724562728-afc824a36e84',
            'https://images.unsplash.com/photo-1512790182412-b19e6d12bf45',
            'https://images.unsplash.com/photo-1544333323-c241b1c2ca3e',
            'https://images.unsplash.com/photo-1520390138845-fd2d229dd553',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
        ],
        productNames: [
            'Sony A7 IV Mirrorless', 'Canon EOS R6 Mark II', 'Nikon Z8 Body Only', 'Fujifilm X-T5 Silver', 'GoPro HERO12 Black',
            'Sony ZV-E10 Vlogging', 'Canon RF 24-70mm f/2.8L', 'Nikon Zf Mirrorless', 'Fujifilm X100V Black', 'GoPro Max 360'
        ]
    },
    {
        name: 'Audio',
        brands: ['Sony', 'Bose', 'JBL', 'Marshall', 'Sennheiser'],
        images: [
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            'https://images.unsplash.com/photo-1589156206699-bc21e38c8a7d',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944',
            'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a',
            'https://images.unsplash.com/photo-1558089628-66da3fbc6747',
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
            'https://images.unsplash.com/photo-1572536147748-ae512357b321',
            'https://images.unsplash.com/photo-1572916140888-8250683f120e',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b'
        ],
        productNames: [
            'Sony WH-1000XM5 ANC', 'Bose QuietComfort Ultra', 'JBL Flip 6 Waterproof', 'Marshall Emberton II', 'Sennheiser Momentum 4',
            'Sony WF-1000XM5 Buds', 'Bose SoundLink Revolve+', 'JBL PartyBox 710', 'Marshall Stanmore III', 'Sennheiser HD 600'
        ]
    }
];
async function main() {
    console.log('--- Cleaning up existing database ---');
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    console.log('--- Seeding hyper-realistic Shopee catalog ---');
    for (const categoryInfo of CATEGORIES) {
        console.log(`Seeding category: ${categoryInfo.name}`);
        for (let i = 0; i < 10; i++) {
            const name = categoryInfo.productNames[i];
            const imageUrl = `${categoryInfo.images[i]}?auto=format&fit=crop&w=800&q=80`;
            const brand = categoryInfo.brands[Math.floor(Math.random() * categoryInfo.brands.length)];
            let basePrice = 0;
            if (categoryInfo.name === 'Phones')
                basePrice = 5000000 + Math.random() * 35000000;
            else if (categoryInfo.name === 'Computers')
                basePrice = 12000000 + Math.random() * 60000000;
            else if (categoryInfo.name === 'Watches')
                basePrice = 2000000 + Math.random() * 250000000;
            else if (categoryInfo.name === 'Fashion')
                basePrice = 200000 + Math.random() * 5000000;
            else if (categoryInfo.name === 'Home Appliances')
                basePrice = 1000000 + Math.random() * 25000000;
            else if (categoryInfo.name === 'Gaming')
                basePrice = 500000 + Math.random() * 15000000;
            else if (categoryInfo.name === 'Cameras')
                basePrice = 5000000 + Math.random() * 80000000;
            else if (categoryInfo.name === 'Audio')
                basePrice = 500000 + Math.random() * 10000000;
            const price = Math.round(basePrice / 1000) * 1000;
            const stock = 10 + Math.floor(Math.random() * 5000);
            const sold = 100 + Math.floor(Math.random() * 10000);
            const rating = 4.2 + Math.random() * 0.8;
            let originalPrice = undefined;
            if (Math.random() > 0.6) {
                const discountPercent = 10 + Math.floor(Math.random() * 60);
                originalPrice = Math.round((price / (1 - discountPercent / 100)) / 1000) * 1000;
            }
            await prisma.product.create({
                data: {
                    name,
                    description: `This premium ${name} from ${brand} delivers exceptional quality and performance. Perfect for your ${categoryInfo.name} lifestyle.`,
                    price,
                    originalPrice,
                    stock,
                    sold,
                    rating,
                    category: categoryInfo.name,
                    imageUrl,
                    brand
                }
            });
        }
    }
    console.log(`Successfully seeded ${CATEGORIES.length * 10} products across 8 categories.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map