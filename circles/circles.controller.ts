import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CirclesService } from './circles.service';
import { CreateCircleDto } from './dto/create-circle.dto';
import { JoinCircleDto } from './dto/join-circle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Circles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('circles')
export class CirclesController {
  constructor(private readonly circlesService: CirclesService) {}

  @ApiBody({ type: CreateCircleDto })
  @Post()
  create(@Body() createCircleDto: CreateCircleDto, @GetUser() user: any) {
    return this.circlesService.create(createCircleDto, user);
  }

  @ApiBody({ type: JoinCircleDto })
  @Post('join')
  join(@Body() joinCircleDto: JoinCircleDto, @GetUser() user: any) {
    return this.circlesService.join(joinCircleDto, user);
  }

  @Get('my-circles')
  findAll(@GetUser() user: any) {
    return this.circlesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.circlesService.findOne(id);
  }

  @Post(':id/start')
  startCycle(@Param('id') id: string, @GetUser() user: any) {
    return this.circlesService.startCycle(id, user);
  }
}
