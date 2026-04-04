import { PrismaClient } from '@prisma/client';
import { Client } from '@elastic/elasticsearch';

const prisma = new PrismaClient();
const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

async function sync() {
  console.log('--- Starting Standalone Elasticsearch Sync ---');
  
  try {
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products to sync.`);

    // Check if index exists, if so delete to start fresh (to avoid stale data)
    const indexExists = await esClient.indices.exists({ index: 'products' });
    if (indexExists) {
      console.log('Deleting existing index "products"...');
      await esClient.indices.delete({ index: 'products' });
    }

    console.log('Creating new index "products"...');
    // @ts-ignore
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
      // @ts-ignore
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
  } catch (error) {
    console.error('Error during sync:', error);
  } finally {
    await prisma.$disconnect();
  }
}

sync();
