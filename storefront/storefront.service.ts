import { Injectable } from '@nestjs/common';
import { CreateStorefrontDto } from './dto/create-storefront.dto';
import { UpdateStorefrontDto } from './dto/update-storefront.dto';

@Injectable()
export class StorefrontService {
  create(createStorefrontDto: CreateStorefrontDto) {
    return 'This action adds a new storefront';
  }

  findAll() {
    return `This action returns all storefront`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storefront`;
  }

  update(id: number, updateStorefrontDto: UpdateStorefrontDto) {
    return `This action updates a #${id} storefront`;
  }

  remove(id: number) {
    return `This action removes a #${id} storefront`;
  }
}
