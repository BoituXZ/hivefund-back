import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CirclesService } from './circles.service';
import { CreateCircleDto } from './dto/create-circle.dto';
import { UpdateCircleDto } from './dto/update-circle.dto';

@Controller('circles')
export class CirclesController {
  constructor(private readonly circlesService: CirclesService) {}

  @Post()
  create(@Body() createCircleDto: CreateCircleDto) {
    return this.circlesService.create(createCircleDto);
  }

  @Get()
  findAll() {
    return this.circlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.circlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCircleDto: UpdateCircleDto) {
    return this.circlesService.update(+id, updateCircleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.circlesService.remove(+id);
  }
}
