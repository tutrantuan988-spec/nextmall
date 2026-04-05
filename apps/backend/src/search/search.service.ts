import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly index = 'products';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    // await this.createIndex();
  }

  private async createIndex() {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: this.index,
    });

    if (!indexExists) {
      await this.elasticsearchService.indices.create({
        index: this.index,
        body: {
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
        },
      });
    }
  }

  async indexProduct(product: any) {
    // @ts-ignore
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

  async updateProduct(id: string, product: any) {
    // @ts-ignore
    return this.elasticsearchService.update({
      index: this.index,
      id,
      body: {
        doc: product,
      },
    });
  }

  async removeProduct(id: string) {
    // @ts-ignore
    return this.elasticsearchService.delete({
      index: this.index,
      id,
    });
  }

  async search(query: string) {
    // @ts-ignore
    const response: any = await this.elasticsearchService.search({
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

    return response.body.hits.hits.map((hit: any) => hit._source);
  }

  async suggest(query: string) {
    // @ts-ignore
    const response: any = await this.elasticsearchService.search({
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

    return response.body.hits.hits.map((hit: any) => hit._source);
  }
}
