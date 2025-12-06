import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StorefrontService } from './storefront.service';
import { CreateStorefrontDto } from './dto/create-storefront.dto';
import { UpdateStorefrontDto } from './dto/update-storefront.dto';

@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Post()
  create(@Body() createStorefrontDto: CreateStorefrontDto) {
    return this.storefrontService.create(createStorefrontDto);
  }

  @Get()
  findAll() {
    return this.storefrontService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storefrontService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStorefrontDto: UpdateStorefrontDto) {
    return this.storefrontService.update(+id, updateStorefrontDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storefrontService.remove(+id);
  }
}
