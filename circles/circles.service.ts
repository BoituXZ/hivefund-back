import { Injectable } from '@nestjs/common';
import { CreateCircleDto } from './dto/create-circle.dto';
import { UpdateCircleDto } from './dto/update-circle.dto';

@Injectable()
export class CirclesService {
  create(createCircleDto: CreateCircleDto) {
    return 'This action adds a new circle';
  }

  findAll() {
    return `This action returns all circles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} circle`;
  }

  update(id: number, updateCircleDto: UpdateCircleDto) {
    return `This action updates a #${id} circle`;
  }

  remove(id: number) {
    return `This action removes a #${id} circle`;
  }
}
