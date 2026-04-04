import { OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
export declare class SearchService implements OnModuleInit {
    private readonly elasticsearchService;
    private readonly index;
    constructor(elasticsearchService: ElasticsearchService);
    onModuleInit(): Promise<void>;
    private createIndex;
    indexProduct(product: any): Promise<import("@elastic/elasticsearch/lib/api/types").WriteResponseBase>;
    updateProduct(id: string, product: any): Promise<import("@elastic/elasticsearch/lib/api/types").UpdateResponse<unknown>>;
    removeProduct(id: string): Promise<import("@elastic/elasticsearch/lib/api/types").WriteResponseBase>;
    search(query: string): Promise<any>;
    suggest(query: string): Promise<any>;
}
