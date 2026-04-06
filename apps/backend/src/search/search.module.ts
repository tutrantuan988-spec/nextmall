import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

const esNode = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
const esEnabled = !!process.env.ELASTICSEARCH_NODE;

@Module({
  imports: [
    ...(esEnabled
      ? [
          ElasticsearchModule.register({
            node: esNode,
          }),
        ]
      : []),
  ],
  providers: [
    {
      provide: SearchService,
      useFactory: (...args: any[]) => {
        if (!esEnabled) {
          console.warn(
            '[SearchModule] ELASTICSEARCH_NODE not set. Search is disabled.',
          );
          // Return a stub service that returns empty results
          return {
            onModuleInit: async () => {},
            indexProduct: async () => ({}),
            updateProduct: async () => ({}),
            removeProduct: async () => ({}),
            search: async () => [],
            suggest: async () => [],
          };
        }
        const esService = args[0];
        return new SearchService(esService);
      },
      inject: esEnabled ? ['ElasticsearchService'] : [],
    },
  ],
  controllers: [SearchController],
  exports: [SearchService],
})
export class SearchModule {}
