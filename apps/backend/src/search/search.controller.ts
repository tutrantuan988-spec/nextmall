import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
  ) {}

  @Get()
  async search(@Query('q') query: string) {
    if (!query) return [];
    return this.searchService.search(query);
  }

  @Get('suggest')
  async suggest(@Query('q') query: string) {
    if (!query) return [];
    return this.searchService.suggest(query);
  }
}

