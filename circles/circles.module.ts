import { Module } from '@nestjs/common';
import { CirclesService } from './circles.service';
import { CirclesController } from './circles.controller';

@Module({
  controllers: [CirclesController],
  providers: [CirclesService],
})
export class CirclesModule {}
