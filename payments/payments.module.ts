import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Transaction } from './entities/transaction.entity';
import { Subscription } from './entities/subscription.entity';
import { Contribution } from './entities/contribution.entity';
import { Badge } from './entities/badge.entity';
import { UserBadge } from './entities/user-badge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Subscription,
      Contribution,
      Badge,
      UserBadge,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
