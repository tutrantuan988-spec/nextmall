"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const elasticsearch_1 = require("@elastic/elasticsearch");
const prisma = new client_1.PrismaClient();
const esClient = new elasticsearch_1.Client({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});
async function sync() {
    console.log('--- Starting Standalone Elasticsearch Sync ---');
    try {
        const products = await prisma.product.findMany();
        console.log(`Found ${products.length} products to sync.`);
        const indexExists = await esClient.indices.exists({ index: 'products' });
        if (indexExists) {
            console.log('Deleting existing index "products"...');
            await esClient.indices.delete({ index: 'products' });
        }
        console.log('Creating new index "products"...');
        await esClient.indices.create({
            index: 'products',
            body: {
                mappings: {
                    properties: {
                        id: { type: 'keyword' },
                        name: { type: 'text', analyzer: 'standard' },
                        description: { type: 'text' },
                        price: { type: 'float' },
                        originalPrice: { type: 'float' },
                        category: { type: 'keyword' },
                        brand: { type: 'keyword' },
                        imageUrl: { type: 'keyword' },
                        rating: { type: 'float' },
                        sold: { type: 'integer' },
                    },
                },
            },
        });
        for (const product of products) {
            console.log(`Indexing product: ${product.name} [${product.category}]`);
            await esClient.index({
                index: 'products',
                id: product.id,
                body: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    category: product.category,
                    brand: product.brand,
                    imageUrl: product.imageUrl,
                    rating: product.rating,
                    sold: product.sold,
                },
            });
        }
        console.log('--- Sync Completed Successfully ---');
    }
    catch (error) {
        console.error('Error during sync:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
sync();
//# sourceMappingURL=sync-search-standalone.js.map