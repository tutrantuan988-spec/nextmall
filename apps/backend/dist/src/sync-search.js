"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const elasticsearch_1 = require("@elastic/elasticsearch");
const prisma = new client_1.PrismaClient();
const esClient = new elasticsearch_1.Client({ node: 'http://localhost:9200' });
const INDEX_NAME = 'products';
async function sync() {
    try {
        console.log('--- Connecting to Database ---');
        const products = await prisma.product.findMany();
        console.log(`Found ${products.length} products.`);
        console.log('--- Checking Elasticsearch Index ---');
        const exists = await esClient.indices.exists({ index: INDEX_NAME });
        if (exists) {
            console.log('Deleting existing index...');
            await esClient.indices.delete({ index: INDEX_NAME });
        }
        console.log('--- Creating Index with New Mappings ---');
        await esClient.indices.create({
            index: INDEX_NAME,
            settings: {
                analysis: {
                    analyzer: {
                        autocomplete_analyzer: {
                            type: 'custom',
                            tokenizer: 'autocomplete_tokenizer',
                            filter: ['lowercase'],
                        },
                    },
                    tokenizer: {
                        autocomplete_tokenizer: {
                            type: 'edge_ngram',
                            min_gram: 2,
                            max_gram: 20,
                            token_chars: ['letter', 'digit'],
                        },
                    },
                },
            },
            mappings: {
                properties: {
                    id: { type: 'keyword' },
                    name: {
                        type: 'text',
                        fields: {
                            suggest: {
                                type: 'text',
                                analyzer: 'autocomplete_analyzer',
                                search_analyzer: 'standard',
                            },
                        },
                    },
                    description: { type: 'text' },
                    price: { type: 'float' },
                    originalPrice: { type: 'float' },
                    stock: { type: 'integer' },
                    sold: { type: 'integer' },
                    imageUrl: { type: 'keyword' },
                    category: { type: 'keyword' },
                    brand: { type: 'keyword' },
                },
            },
        });
        console.log('--- Indexing Products ---');
        for (const product of products) {
            console.log(`Indexing product: ${product.name}`);
            await esClient.index({
                index: INDEX_NAME,
                id: product.id,
                document: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    stock: product.stock,
                    sold: product.sold,
                    imageUrl: product.imageUrl,
                    category: product.category,
                    brand: product.brand,
                },
            });
        }
        console.log('--- Sync Successful ---');
    }
    catch (error) {
        console.error('--- Sync Failed ---');
        console.error(error);
    }
    finally {
        await prisma.$disconnect();
    }
}
sync();
//# sourceMappingURL=sync-search.js.map