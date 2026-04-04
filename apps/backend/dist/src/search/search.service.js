"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@nestjs/elasticsearch");
let SearchService = class SearchService {
    elasticsearchService;
    index = 'products';
    constructor(elasticsearchService) {
        this.elasticsearchService = elasticsearchService;
    }
    async onModuleInit() {
    }
    async createIndex() {
        const indexExists = await this.elasticsearchService.indices.exists({
            index: this.index,
        });
        if (!indexExists) {
            await this.elasticsearchService.indices.create({
                index: this.index,
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
        }
    }
    async indexProduct(product) {
        return this.elasticsearchService.index({
            index: this.index,
            id: product.id,
            body: {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                originalPrice: product.originalPrice,
                stock: product.stock,
                sold: product.sold,
                rating: product.rating,
                imageUrl: product.imageUrl,
                category: product.category,
                brand: product.brand,
            },
        });
    }
    async updateProduct(id, product) {
        return this.elasticsearchService.update({
            index: this.index,
            id,
            body: {
                doc: product,
            },
        });
    }
    async removeProduct(id) {
        return this.elasticsearchService.delete({
            index: this.index,
            id,
        });
    }
    async search(query) {
        const response = await this.elasticsearchService.search({
            index: this.index,
            body: {
                query: {
                    multi_match: {
                        query,
                        fields: ['name^3', 'category^2', 'description'],
                        fuzziness: 'AUTO',
                    },
                },
            },
        });
        return response.body.hits.hits.map((hit) => hit._source);
    }
    async suggest(query) {
        const response = await this.elasticsearchService.search({
            index: this.index,
            body: {
                query: {
                    match: {
                        'name.suggest': {
                            query,
                            analyzer: 'standard',
                        },
                    },
                },
                size: 5,
            },
        });
        return response.body.hits.hits.map((hit) => hit._source);
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [elasticsearch_1.ElasticsearchService])
], SearchService);
//# sourceMappingURL=search.service.js.map