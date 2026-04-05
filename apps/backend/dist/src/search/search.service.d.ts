import { OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
export declare class SearchService implements OnModuleInit {
    private readonly elasticsearchService;
    private readonly index;
    constructor(elasticsearchService: ElasticsearchService);
    onModuleInit(): Promise<void>;
    private createIndex;
    indexProduct(product: any): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    updateProduct(id: string, product: any): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    removeProduct(id: string): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    search(query: string): Promise<any>;
    suggest(query: string): Promise<any>;
}
